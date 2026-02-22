import { useActivities } from "./use-activities";
import { useLogs } from "./use-logs";

export function useSummary() {
  const { data: activities = [] } = useActivities();
  const { data: logs = [], isLoading } = useLogs();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  // ポイントの合計を計算する関数
  const calculatePoints = (targetLogs: any[]) => {
    return (targetLogs || []).reduce((sum, log) => {
      const activity = activities.find(a => a.id === log.activityId);
      return sum + (activity?.points || 0);
    }, 0);
  };

  // 今日のログを抽出
  const todayLogs = (logs || []).filter((log: any) => 
    log?.timestamp && new Date(log.timestamp).getTime() >= startOfToday
  );

  // --- 連続記録日数（ストリーク）の計算ロジック ---
  let streak = 0;
  if (logs.length > 0) {
    // 1. 日付ごとにログをグループ化し、日別合計ポイントを計算
    const dailyPoints = new Map<string, number>();
    logs.forEach((log: any) => {
      if (!log.timestamp) return;
      // YYYY-MM-DD 形式の日付文字列を取得
      const dateStr = new Date(log.timestamp).toLocaleDateString("ja-JP");
      const activity = activities.find(a => a.id === log.activityId);
      const points = activity?.points || 0;
      dailyPoints.set(dateStr, (dailyPoints.get(dateStr) || 0) + points);
    });

    // 2. 今日から過去に遡ってチェック
    for (let i = 0; ; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toLocaleDateString("ja-JP");

      const points = dailyPoints.get(dateStr);

      if (points !== undefined && points > 0) {
        // その日の合計がプラスならストリーク継続
        streak++;
      } else if (i === 0 && points === undefined) {
        // 今日まだ記録がない場合は、ストリークが途切れたとはみなさず、昨日の続きを確認する
        // (今日の分はカウントしない)
        continue;
      } else {
        // 記録がない日、または合計が0以下だった日でストリーク終了
        break;
      }
    }
  }

  return {
    todayPoints: calculatePoints(todayLogs),
    totalPoints: calculatePoints(logs || []),
    streak, // 計算した連続日数を返す
    isLoading
  };
}
