import { useActivities } from "@/hooks/use-activities";
import { useSummary } from "@/hooks/use-summary";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { RecentLogs } from "@/components/RecentLogs";
import { ActivityButton } from "@/components/ActivityButton";
import { ManageActivities } from "@/components/ManageActivities";
import { StreakHeader } from "@/components/StreakHeader"; // 追加
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: activities = [], isLoading: actLoading } = useActivities();
  const summary = useSummary();

  if (actLoading || summary.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] pb-20">
      {/* 新しいヘッダーをここに追加 */}
      <StreakHeader />

      {/* ヘッダーの分だけ上に余白を開ける */}
      <div className="mx-auto max-w-3xl space-y-8 pt-20 px-4">
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <AvatarDisplay />
          <RecentLogs />
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today Points</p>
              <p className="text-4xl font-black text-emerald-500">{summary.todayPoints}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Points</p>
              <p className="text-4xl font-black text-slate-700">{summary.totalPoints}</p>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4 text-center">
          <h2 className="text-lg font-bold text-slate-800">できた事を記録する</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {activities.length > 0 ? (
              activities.map((activity: any) => (
                <ActivityButton key={activity.id} activity={activity} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-10 w-full text-center">
                「項目のカスタマイズ」から追加してください
              </p>
            )}
          </div>
        </section>

        <ManageActivities />
      </div>
    </div>
  );
}
