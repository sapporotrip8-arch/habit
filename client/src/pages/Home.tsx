import { useActivities } from "@/hooks/use-activities";
import { useSummary } from "@/hooks/use-summary";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { ActivityButton } from "@/components/ActivityButton";
import { ManageActivities } from "@/components/ManageActivities";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: activities = [], isLoading: actLoading } = useActivities();
  const summary = useSummary();

  // 読み込み中の画面
  if (actLoading || summary.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] p-4 pb-20">
      <div className="mx-auto max-w-2xl space-y-8 pt-8">
        {/* アバター表示（ここが100点やマイナスで変化します） */}
        <AvatarDisplay />

        {/* スコア表示（回数ではなく「ポイント」を表示） */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</p>
              <p className="text-4xl font-black text-emerald-500">{summary.todayPoints}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-4xl font-black text-slate-700">{summary.totalPoints}</p>
            </CardContent>
          </Card>
        </div>

        {/* ボタン一覧 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 text-center">できた事を記録する</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {activities.length > 0 ? (
              activities.map((activity: any) => (
                <ActivityButton key={activity.id} activity={activity} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-10">
                「項目のカスタマイズ」から追加してください
              </p>
            )}
          </div>
        </section>

        {/* 項目設定メニュー */}
        <ManageActivities />
      </div>
    </div>
  );
}
