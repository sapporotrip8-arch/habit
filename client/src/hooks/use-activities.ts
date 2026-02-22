import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

// 1. 一覧を取得する機能
export function useActivities() {
  return useQuery({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "activities"));
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });
}

// 2. 新しく追加する機能
export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAct: any) => {
      const docRef = await addDoc(collection(db, "activities"), newAct);
      return { id: docRef.id, ...newAct };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/activities"] }),
  });
}

// 3. 削除する機能（これがエラーの原因になっていた部分です）
export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "activities", id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/activities"] }),
  });
}
