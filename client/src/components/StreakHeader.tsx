import { useSummary } from "@/hooks/use-summary";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakHeader() {
  const { streak, isLoading } = useSummary();

  if (isLoading) return null;

  const isStreaking = streak > 0;
  const text = isStreaking ? `${streak}日間連続記録中！` : "0日間連続記録";
  
  // ストリーク中なら炎の色をオレンジに、そうでなければグレーに
  const iconColor = isStreaking ? "text-orange-500" : "text-slate-400";
  const textColor = isStreaking ? "text-orange-700 font-bold" : "text-slate-500 font-medium";
  const bgColor = isStreaking ? "bg-orange-50" : "bg-slate-50/50";

  return (
    <div className={`w-full py-3 px-4 flex justify-center items-center ${bgColor} border-b border-slate-100/50 backdrop-blur-sm fixed top-0 z-10`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2"
      >
        <Flame className={`h-5 w-5 ${iconColor} ${isStreaking ? "animate-pulse" : ""}`} />
        <span className={`text-sm ${textColor}`}>{text}</span>
      </motion.div>
    </div>
  );
}
