import { useSummary } from "@/hooks/use-summary";
import { motion } from "framer-motion";

export function AvatarDisplay() {
  const { totalPoints, isLoading } = useSummary();

  if (isLoading) return <div className="h-48 w-48 rounded-full bg-slate-200 animate-pulse mx-auto" />;

  // 表情の判定
  let expression = "😐"; // 通常
  let filterClass = "";
  
  if (totalPoints >= 100) {
    expression = "😊"; // 笑顔
    filterClass = "saturate-150 brightness-110";
  } else if (totalPoints < 0) {
    expression = "😢"; // 悲しい顔
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
          {/* ドールの画像を表示 */}
          <img 
            src="/avatar.png" 
            alt="Avatar" 
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")}
          />
        </motion.div>
        
        {/* 表情アイコンのオーバーレイ */}
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg text-3xl">
          {expression}
        </div>
      </div>
    </div>
  );
}
