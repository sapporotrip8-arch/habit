import { useLogs } from "@/hooks/use-logs";
import { useActivities } from "@/hooks/use-activities";
import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export function RecentLogs() {
  const { data: logs = [] } = useLogs();
  const { data: activities = [] } = useActivities();

  // 最新の5件を抽出して名前とポイントを紐付け
  const recent = logs.slice(0, 5).map(log => {
    const activity = activities.find(a => a.id === log.activityId);
    return {
      id: log.id,
      name: activity?.name || "不明な項目",
      points: activity?.points || 0,
    };
  });

  return (
    <Card className="w-full md:w-64 border-none shadow-sm bg-white/50 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3 text-slate-600 font-bold text-sm border-b border-slate-100 pb-2">
          <History className="h-4 w-4" />
          <span>最近の記録（5件）</span>
        </div>
        <div className="space-y-3">
          {recent.length > 0 ? (
            recent.map((r) => (
              <div key={r.id} className="text-xs flex justify-between items-center">
                <span className="text-slate-700 font-medium truncate max-w-[120px]">{r.name}</span>
                {/* 時間の代わりにポイント数を表示 */}
                <span className={`font-mono font-bold ${r.points >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {r.points > 0 ? `+${r.points}` : r.points}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">まだ記録はありません</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
