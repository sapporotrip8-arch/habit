import React, { useState } from "react";
import { useActivities, useCreateActivity, useDeleteActivity } from "@/hooks/use-activities";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function ManageActivities() {
  const { data: activities, isLoading } = useActivities();
  const createMutation = useCreateActivity();
  const deleteMutation = useDeleteActivity();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [points, setPoints] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !points) return;

    try {
      await createMutation.mutateAsync({
        name,
        points: parseInt(points, 10),
      });
      setName("");
      setPoints("");
      toast({
        title: "Activity added!",
        description: "Your new habit has been created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add activity",
      });
    }
  };

  const handleDelete = async (id: number, activityName: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Activity removed",
        description: `${activityName} has been deleted.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete activity",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-xl border-4 border-white">
      <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
        🛠️ 項目のカスタマイズ
      </h3>

      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="例：英語学習、ドール製作など"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-5 py-4 rounded-2xl bg-white border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium"
          required
        />
        <input
          type="number"
          placeholder="ポイント"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full sm:w-32 px-5 py-4 rounded-2xl bg-white border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium"
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={createMutation.isPending}
          className="px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-playful-sm hover:shadow-playful-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          追加
        </motion.button>
      </form>

      <div className="space-y-3">
        {activities?.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg ${activity.points > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {activity.points > 0 ? '+' : ''}{activity.points}
              </div>
              <span className="font-semibold text-lg">{activity.name}</span>
            </div>

            <button
              onClick={() => handleDelete(activity.id, activity.name)}
              disabled={deleteMutation.isPending}
              className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-destructive/50"
              aria-label="Delete activity"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}

        {activities?.length === 0 && (
          <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-3xl">
            まだ項目がありません。上のフォームから追加してください。
          </div>
        )}
      </div>
    </div>
  );
}