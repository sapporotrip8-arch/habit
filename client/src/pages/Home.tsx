import React, { useState } from "react";
import { useActivities } from "@/hooks/use-activities";
import { useSummary } from "@/hooks/use-summary";
import { useCreateLog, useLogs, useDeleteLog } from "@/hooks/use-logs"; // useDeleteLogを追加
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { ActivityButton } from "@/components/ActivityButton";
import { ManageActivities } from "@/components/ManageActivities";
import { Loader2, CheckCircle2, History, Trash2 } from "lucide-react"; // Trash2を追加
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useSummary();
  const { data: activities, isLoading: isLoadingActivities } = useActivities();
  const { data: logs, isLoading: isLoadingLogs } = useLogs();
  const logMutation = useCreateLog();
  const deleteLogMutation = useDeleteLog(); // 削除用の命令を準備
  const { toast } = useToast();

  const [pendingActivityId, setPendingActivityId] = useState<number | null>(null);

  const handleLogActivity = async (activityId: number, name: string, points: number) => {
    setPendingActivityId(activityId);
    try {
      await logMutation.mutateAsync(activityId);
      toast({
        title: points > 0 ? "一歩 夢に近づいた！ 🎉" : "おっと！ 😅",
        description: `「${name}」を記録しました (${points > 0 ? '+' : ''}${points} pts)`,
        className: points > 0 ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "記録に失敗しました。もう一度試してください。",
      });
    } finally {
      setPendingActivityId(null);
    }
  };

  const handleDeleteLog = async (id: number, activityName: string) => {
    try {
      await deleteLogMutation.mutateAsync(id);
      toast({
        title: "記録を削除しました",
        description: `「${activityName}」の記録を取り消しました。`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "削除に失敗しました。",
      });
    }
  };

  if (isLoadingSummary || isLoadingActivities || isLoadingLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString();
  const todayLogs = logs?.filter(log => new Date(log.createdAt).toLocaleDateString() === today) || [];
  const displayLogs = todayLogs.slice(-5).reverse();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">

      <section className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10">
        <div className="flex-shrink-0">
          <AvatarDisplay 
            todayPoints={summary?.todayPoints ?? 0} 
            totalPoints={summary?.totalPoints ?? 0} 
          />
        </div>

        <div className="w-full md:w-80">
          <div className="bg-white/40 backdrop-blur-md p-5 rounded-[2rem] shadow-lg border-2 border-white/50">
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <History className="text-primary w-4 h-4" />
              最近の記録（5件）
            </h2>

            <div className="space-y-2">
              {displayLogs.length > 0 ? (
                <AnimatePresence initial={false}>
                  {displayLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-white shadow-sm group"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 text-xs truncate">{log.activityName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${log.points > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {log.points > 0 ? '+' : ''}{log.points}
                        </span>

                        {/* 削除ボタンの追加 */}
                        <button
                          onClick={() => handleDeleteLog(log.id, log.activityName)}
                          disabled={deleteLogMutation.isPending}
                          className="p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <p className="text-center py-4 text-muted-foreground text-xs italic">
                  まだ記録はありません
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-white">
        <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
          できた事を記録する
        </h2>

        {activities && activities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {activities.map((activity) => (
              <ActivityButton
                key={activity.id}
                name={activity.name}
                points={activity.points}
                isPending={pendingActivityId === activity.id}
                onClick={() => handleLogActivity(activity.id, activity.name, activity.points)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white/50 rounded-3xl border-2 border-dashed border-border text-muted-foreground font-medium text-sm">
            項目を下の「項目のカスタマイズ」から追加してください。
          </div>
        )}
      </section>

      <section>
        <ManageActivities />
      </section>

      <footer className="text-center text-muted-foreground pb-8 font-medium text-sm">
        一歩ずつ、理想の自分へ。毎日が進化のチャンスです！ 🌟
      </footer>
    </div>
  );
}