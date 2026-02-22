export function useSummary() {
  const { data: logs = [], isLoading } = useLogs();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  // 今日のログを正確に判定
  const todayLogs = logs.filter((log: any) => 
    log?.timestamp && new Date(log.timestamp).getTime() >= startOfToday
  );

  return {
    data: {
      today: todayLogs.length,
      total: logs.length,
      streak: 0,
      achievements: 0
    },
    isLoading
  };
}
