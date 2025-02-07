import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubscriptionCardProps {
  role: string;
  messageCount: number;
  daysUntilReset: number;
}

export const SubscriptionCard = ({ role, messageCount, daysUntilReset }: SubscriptionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          {role === 'premium' 
            ? 'You have access to all premium features'
            : 'Upgrade to premium for unlimited messages and advanced features'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-neutral-500 capitalize">{role}</p>
            </div>
            {role !== 'premium' && (
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Upgrade to Premium
              </Button>
            )}
          </div>
          
          {role === 'free' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Message Limit</span>
                <span>{messageCount}/50 messages</span>
              </div>
              <Progress value={(messageCount / 50) * 100} />
              <p className="text-xs text-neutral-500">
                Resets in {daysUntilReset} days
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};