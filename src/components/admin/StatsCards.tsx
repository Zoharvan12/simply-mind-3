
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserStats {
  total_users: number;
  free_users: number;
  premium_users: number;
}

interface StatsCardsProps {
  stats: UserStats | null;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{stats?.total_users || 0}</CardTitle>
          <CardDescription>Total Users</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{stats?.free_users || 0}</CardTitle>
          <CardDescription>Free Users</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{stats?.premium_users || 0}</CardTitle>
          <CardDescription>Premium Users</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
