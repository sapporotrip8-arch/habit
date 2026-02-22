import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useLogs() {
  return useQuery({
    queryKey: ["/api/logs"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "logs"));
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: any) => {
      const log = { activityId, timestamp: new Date().toISOString() };
      const docRef = await addDoc(collection(db, "logs"), log);
      return { id: docRef.id, ...log };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary"] });
    },
  });
}
