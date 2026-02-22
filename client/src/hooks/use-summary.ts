import { useQuery } from "@tanstack/react-query";
import { useLogs } from "./use-logs";

export function useSummary() {
  const { data: logs = [] } = useLogs();
  
  return useQuery({
    // logs が更新されたら集計もやり直すように設定
    queryKey: ["/api/summary", logs], 
    queryFn: async () => {
      const now = new Date();
      // 今日の 0 時 0 分の時間を取得
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      // 今日のログだけを抽出
      const todayLogs = logs.filter((log: any) => 
        new Date(log.timestamp).getTime() >= startOfToday
      );

      return {
        today: todayLogs.length,
        total: logs.length
      };
    },
  });
}
