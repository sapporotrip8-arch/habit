import { useLogs } from "@/hooks/use-logs";
import { useActivities } from "@/hooks/use-activities";
import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export function RecentLogs() {
  const { data: logs = [] } = useLogs();
  const { data: activities = [] } = useActivities();

  const recent = logs.slice(0, 5).map(log => {
    const activity = activities.find(a => a.id === log.activityId);
    return {
      id: log.id,
      name: activity?.name || "不明な項目",
      points: activity?.points || 0,
    };
  });

  return (
    <Card className="w-full border-none shadow-sm bg-white/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold text-xs border-b border-slate-100/50 pb-2">
          <History className="h-3 w-3" />
          <span>最近の記録（5件）</span>
        </div>
        <div className="space-y-2">
          {recent.length > 0 ? (
            recent.map((r) => (
              <div key={r.id} className="text-xs flex justify-between items-center py-1">
                <span className="text-slate-600 font-medium truncate pr-4">{r.name}</span>
                <span className={`font-mono font-bold ${r.points >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {r.points > 0 ? `+${r.points}` : r.points}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-muted-foreground text-center py-2">まだ記録はありません</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
