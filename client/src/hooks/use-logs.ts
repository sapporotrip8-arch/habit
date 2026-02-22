import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.logs.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activityId: number) => {
      const validated = api.logs.create.input.parse({ activityId });
      const res = await fetch(api.logs.create.path, {
        method: api.logs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.logs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) {
          const error = api.logs.create.responses[404].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create log");
      }
      return api.logs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate both logs and summary when a new log is created
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.summary.get.path] });
    },
  });
}
