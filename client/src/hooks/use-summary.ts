import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSummary() {
  return useQuery({
    queryKey: [api.summary.get.path],
    queryFn: async () => {
      const res = await fetch(api.summary.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch summary");
      return api.summary.get.responses[200].parse(await res.json());
    },
  });
}
