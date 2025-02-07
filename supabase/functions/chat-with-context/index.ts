
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JournalEntry {
  content: string;
  emotion_rating: number;
  created_at: string;
  title: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, chatId, isFirstMessage } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Failed to get user');
    }

    // Fetch recent journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('content, emotion_rating, created_at, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (journalError) {
      throw new Error('Failed to fetch journal entries');
    }

    // Calculate average emotion rating
    const avgEmotionRating = journalEntries?.length > 0
      ? journalEntries.reduce((sum, entry) => sum + entry.emotion_rating, 0) / journalEntries.length
      : null;

    // Create context summary from journal entries
    const contextSummary = journalEntries?.map(entry => 
      `On ${new Date(entry.created_at).toLocaleDateString()}, user wrote "${entry.title}" with emotion rating ${entry.emotion_rating}/10: ${entry.content}`
    ).join('\n');

    // Prepare system message with context
    const systemMessage = `You are an empathetic AI assistant who understands the user's emotional context. 
    
Recent context about the user:
${contextSummary || "No recent journal entries available."}
${avgEmotionRating ? `\nUser's average emotional rating: ${avgEmotionRating.toFixed(1)}/10` : ""}

Based on this context, provide supportive and relevant responses. If the user seems to be struggling emotionally, be extra empathetic and supportive. Always maintain a positive and encouraging tone while acknowledging their feelings.`;

    // If it's the first message, generate a title
    if (isFirstMessage) {
      console.log('Generating title for first message...');
      
      const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Generate a short, concise title (max 50 characters) that captures the main topic or intent of this message. Return only the title, nothing else.' 
            },
            { role: 'user', content }
          ],
        }),
      });

      if (!titleResponse.ok) {
        throw new Error('Failed to generate title');
      }

      const titleData = await titleResponse.json();
      const generatedTitle = titleData.choices[0].message.content.trim();
      console.log('Generated title:', generatedTitle);

      // Update chat title
      const { error: updateError } = await supabase
        .from('chats')
        .update({ title: generatedTitle })
        .eq('id', chatId);

      if (updateError) {
        console.error('Error updating chat title:', updateError);
        throw new Error('Failed to update chat title');
      }
      
      console.log('Successfully updated chat title');
    }

    // Get AI response
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content }
        ],
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const aiData = await openAIResponse.json();
    const aiMessage = aiData.choices[0].message.content;

    // Store AI response in database
    const { error: insertError } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        role: 'ai',
        content: aiMessage
      }]);

    if (insertError) {
      throw new Error('Failed to store AI response');
    }

    return new Response(
      JSON.stringify({ message: aiMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-context function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
