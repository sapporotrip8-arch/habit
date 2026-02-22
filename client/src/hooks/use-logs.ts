import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useLogs() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ログを日付順に取得し、変更があったら自動で受け取る設定
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(logs);
      setIsLoading(false);
    });
    return () => unsubscribe(); // 画面を閉じたら監視を終了
  }, []);

  return { data, isLoading };
}

export function useCreateLog() {
  return useMutation({
    mutationFn: async (activityId: string) => {
      const log = { activityId, timestamp: new Date().toISOString() };
      await addDoc(collection(db, "logs"), log);
    }
  });
}

export function useDeleteLog() {
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "logs", id));
    }
  });
}
