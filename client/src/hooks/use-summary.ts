import { useQuery } from "@tanstack/react-query";
import { useLogs } from "./use-logs";

export function useSummary() {
  const { data: logs = [] } = useLogs();
  
  return useQuery({
    queryKey: ["/api/summary", logs.length],
    queryFn: async () => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      const todayLogs = (logs || []).filter((log: any) => 
        log?.timestamp && new Date(log.timestamp).getTime() >= startOfToday
      );

      return {
        today: todayLogs.length,
        total: logs.length,
        streak: 0,
        achievements: 0
      };
    },
    initialData: { today: 0, total: 0, streak: 0, achievements: 0 }
  });
}
