import { useSummary } from "@/hooks/use-summary";
import { motion } from "framer-motion";

export function AvatarDisplay() {
  const summary = useSummary();
  const totalPoints = summary.totalPoints;
  const isLoading = summary.isLoading;

  if (isLoading) {
    return (
      <div className="h-48 w-48 rounded-full bg-slate-200 animate-pulse mx-auto" />
    );
  }

  // 仕様に基づいた画像の判定
  let avatarSrc = "/happy.jpg";
  let filterClass = "";
  
  if (totalPoints >= 100) {
    avatarSrc = "/evolution.jpg";
    filterClass = "saturate-150 brightness-110";
  } else if (totalPoints < 0) {
    avatarSrc = "/sad.jpg";
    filterClass = "grayscale contrast-125";
  }

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          animate={{ scale: totalPoints >= 100 ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`h-48 w-48 rounded-full border-4 border-white shadow-xl overflow-hidden transition-all duration-500 ${filterClass}`}
        >
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            className="h-full w-full object-cover"
            onError={(e) => {
              // 画像がアップロードされていない場合の予備表示
              e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
            }}
          />
        </motion.div>
        {/* 顔文字のオーバーレイを削除しました */}
      </div>
    </div>
  );
}
