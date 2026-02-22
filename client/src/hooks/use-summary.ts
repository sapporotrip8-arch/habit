import { useLogs } from "./use-logs";

export function useSummary() {
  const { data: logs = [], isLoading } = useLogs();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  const todayLogs = logs.filter((log: any) => 
    log?.timestamp && new Date(log.timestamp).getTime() >= startOfToday
  );

  return {
    today: todayLogs.length,
    total: logs.length,
    isLoading
  };
}
