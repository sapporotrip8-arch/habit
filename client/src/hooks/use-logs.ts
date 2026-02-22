import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

// 1. ログ（実施記録）の一覧を取得
export function useLogs() {
  return useQuery({
    queryKey: ["/api/logs"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "logs"));
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });
}

// 2. 新しいログを作成
export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: string) => {
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

// 3. ログを削除（これが不足していた機能です）
export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "logs", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary"] });
    },
  });
}
