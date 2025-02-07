
interface EmotionEmojiProps {
  rating: number;
}

export const EmotionEmoji = ({ rating }: EmotionEmojiProps) => {
  const getEmoji = (rating: number) => {
    if (rating >= 9) return "🤗";
    if (rating >= 7) return "😊";
    if (rating >= 5) return "😐";
    if (rating >= 3) return "😔";
    return "😢";
  };

  const getMessage = (rating: number) => {
    if (rating >= 9) return "Wonderful!";
    if (rating >= 7) return "Pretty good!";
    if (rating >= 5) return "Okay";
    if (rating >= 3) return "Not great";
    return "Having a rough time";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-1 animate-fade-in">
      <span className="text-4xl transition-all duration-300">{getEmoji(rating)}</span>
      <span className="text-sm text-muted-foreground font-medium">{getMessage(rating)}</span>
    </div>
  );
};
