import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageSquare, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-lotus-green",
      bg: "bg-lotus-green/10",
    },
    {
      title: "Volunteer Applications",
      value: stats?.totalSubmissions ?? 0,
      icon: FileText,
      color: "text-lotus-orange",
      bg: "bg-lotus-orange/10",
    },
    {
      title: "Pending Review",
      value: stats?.pendingSubmissions ?? 0,
      icon: Clock,
      color: "text-lotus-purple",
      bg: "bg-lotus-purple/10",
    },
    {
      title: "Testimonials",
      value: stats?.totalTestimonials ?? 0,
      icon: MessageSquare,
      color: "text-lotus-yellow",
      bg: "bg-lotus-yellow/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Admin Dashboard
        </h1>
        <p
          className="text-muted-foreground mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Overview of Lotus Children's Centre website
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
