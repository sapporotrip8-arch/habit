import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { collection, onSnapshot, query, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useActivities() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "activities"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(activities);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, []);

  return { data, isLoading };
}

export function useCreateActivity() {
  return useMutation({
    mutationFn: async (newAct: any) => {
      await addDoc(collection(db, "activities"), newAct);
    }
  });
}

export function useDeleteActivity() {
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "activities", id));
    }
  });
}
