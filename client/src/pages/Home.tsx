import { useState } from "react";
import { useActivities } from "@/hooks/use-activities";
import { useSummary } from "@/hooks/use-summary";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { RecentLogs } from "@/components/RecentLogs";
import { ActivityButton } from "@/components/ActivityButton";
import { ManageActivities } from "@/components/ManageActivities";
import { StreakHeader } from "@/components/StreakHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: activities = [], isLoading: actLoading } = useActivities();
  const summary = useSummary();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (actLoading || summary.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] pb-32 relative overflow-x-hidden">
      <StreakHeader />

      <div className="mx-auto max-w-2xl space-y-8 pt-20 px-4">
        
        <div className="flex justify-center">
          <AvatarDisplay />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today Points</p>
              <p className="text-4xl font-black text-emerald-500">{summary.todayPoints}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Points</p>
              <p className="text-4xl font-black text-slate-700">{summary.totalPoints}</p>
            </CardContent>
          </Card>
        </div>

        {/* 記録ボタンセクション */}
        <section className="space-y-4">
          <Button 
            onClick={() => setIsMenuOpen(true)}
            size="lg" 
            className="w-full h-16 rounded-2xl shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold gap-3 text-lg transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-6 w-6" />
            できた事を記録する
          </Button>

          {/* 履歴を記録ボタンのすぐ下に配置 */}
          <RecentLogs />
        </section>

        <ManageActivities />
      </div>

      {/* --- 自作ドロワーメニュー --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 背景の暗転 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            {/* 下から出るパネル */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-slate-50 rounded-t-[32px] z-50 shadow-2xl border-t border-white flex flex-col max-h-[80vh]"
            >
              <div className="p-4 flex flex-col h-full">
                {/* ハンドル（棒） */}
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
                
                <div className="flex justify-between items-center mb-6 px-2">
                  <h3 className="text-xl font-black text-slate-800">何ができましたか？</h3>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-200 rounded-full text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* ボタン一覧（スクロール可能） */}
                <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-10 px-1">
                  {activities.length > 0 ? (
                    activities.map((activity: any) => (
                      <div key={activity.id} onClick={() => setIsMenuOpen(false)}>
                        <ActivityButton activity={activity} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-10 text-center col-span-2">
                      「項目のカスタマイズ」から追加してください
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
