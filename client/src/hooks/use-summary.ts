import { useActivities } from "./use-activities";
import { useLogs } from "./use-logs";

export function useSummary() {
  const { data: activities = [] } = useActivities();
  const { data: logs = [], isLoading } = useLogs();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  // ポイントの合計を計算する関数
  const calculatePoints = (targetLogs: any[]) => {
    return targetLogs.reduce((sum, log) => {
      const activity = activities.find(a => a.id === log.activityId);
      return sum + (activity?.points || 0);
    }, 0);
  };

  const todayLogs = logs.filter((log: any) => 
    log?.timestamp && new Date(log.timestamp).getTime() >= startOfToday
  );

  return {
    todayPoints: calculatePoints(todayLogs), // 今日の合計ポイント
    totalPoints: calculatePoints(logs),      // 全期間の合計ポイント
    isLoading
  };
}
