import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JournalEntry {
  content: string;
  created_at: string;
}

interface AnalysisResult {
  overall_emotion: 'positive' | 'neutral' | 'negative';
  common_topics: string[];
  emotion_intensity: number;
  summary: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Fetch recent journal entries
    const { data: entries, error: entriesError } = await supabaseClient
      .from('journal_entries')
      .select('content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (entriesError) {
      throw new Error('Error fetching journal entries');
    }

    if (!entries || entries.length === 0) {
      throw new Error('No journal entries found');
    }

    // Format entries for GPT analysis
    const entriesText = entries
      .map((entry: JournalEntry) => `Entry (${entry.created_at}): ${entry.content}`)
      .join('\n\n');

    // Analyze with GPT-4o
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an emotional analysis AI. Return ONLY a raw JSON object (no markdown, no code blocks) with these exact fields:
{
  "overall_emotion": one of ["positive", "neutral", "negative"],
  "common_topics": array of strings,
  "emotion_intensity": number from 1 to 10,
  "summary": string with brief analysis
}`
          },
          {
            role: 'user',
            content: `Analyze these journal entries:\n${entriesText}`
          }
        ],
      }),
    });

    const gptData = await response.json();
    console.log('GPT Response:', gptData);

    if (!gptData.choices?.[0]?.message?.content) {
      throw new Error('Invalid GPT response');
    }

    // Clean and parse the response
    const rawResponse = gptData.choices[0].message.content
      .replace(/```json\s*|\s*```/g, '') // Remove any markdown code blocks
      .trim();
    
    console.log('Cleaned response:', rawResponse);
    
    try {
      const analysis: AnalysisResult = JSON.parse(rawResponse);

      // Validate the analysis object
      if (
        !analysis.overall_emotion ||
        !Array.isArray(analysis.common_topics) ||
        typeof analysis.emotion_intensity !== 'number' ||
        !analysis.summary
      ) {
        throw new Error('Invalid analysis format');
      }

      // Store analysis in stats table
      const { error: statsError } = await supabaseClient
        .from('stats')
        .insert([{
          user_id: user.id,
          overall_emotion: analysis.overall_emotion,
          common_topics: analysis.common_topics,
          emotion_intensity: analysis.emotion_intensity,
          summary: analysis.summary
        }]);

      if (statsError) {
        throw new Error('Error storing analysis results');
      }

      return new Response(
        JSON.stringify(analysis),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (parseError) {
      console.error('Error parsing GPT response:', parseError);
      console.error('Raw response was:', rawResponse);
      throw new Error('Failed to parse GPT response');
    }

  } catch (error) {
    console.error('Error in analyze-journal-entries function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});