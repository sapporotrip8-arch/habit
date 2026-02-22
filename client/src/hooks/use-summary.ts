import { useQuery } from "@tanstack/react-query";
import { useLogs } from "./use-logs";

export function useSummary() {
  const { data: logs = [] } = useLogs();
  return useQuery({
    queryKey: ["/api/summary"],
    queryFn: async () => ({
      total: logs.length
    }),
    enabled: true,
  });
}
