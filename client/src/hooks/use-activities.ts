import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useActivities() {
  return useQuery({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "activities"));
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });
}

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
