import React, { useEffect, useState } from "react";
import { Crown, Sparkles, FireExtinguisher, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface AvatarDisplayProps {
  todayPoints: number;
  totalPoints: number;
}

export function AvatarDisplay({ todayPoints, totalPoints }: AvatarDisplayProps) {
  const [hasEvolved, setHasEvolved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  // 日数カウントのロジック
  useEffect(() => {
    const lastDate = localStorage.getItem("lastAchievedDate");
    const savedStreak = parseInt(localStorage.getItem("streak") || "0");
    const savedTotalDays = parseInt(localStorage.getItem("totalDays") || "0");
    const today = new Date().toLocaleDateString();

    // 今日の目標（例：10点以上）を達成したかチェック
    if (todayPoints >= 10 && lastDate !== today) {
      let newStreak = savedStreak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate === yesterday.toLocaleDateString()) {
        newStreak += 1; // 連続達成
      } else {
        newStreak = 1; // 途切れたので1から
      }

      const newTotal = savedTotalDays + 1;

      // 保存
      localStorage.setItem("lastAchievedDate", today);
      localStorage.setItem("streak", newStreak.toString());
      localStorage.setItem("totalDays", newTotal.toString());

      setStreak(newStreak);
      setTotalDays(newTotal);
    } else {
      setStreak(savedStreak);
      setTotalDays(savedTotalDays);
    }
  }, [todayPoints]);

  const isEvolution = totalPoints >= 100;
  const isSad = todayPoints < 0 && !isEvolution;

  const getAvatarImage = () => {
    if (isEvolution) return "/evolution.jpg";
    if (isSad) return "/sad.jpg";
    return "/happy.jpg";
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={isEvolution ? "evolution" : isSad ? "sad" : "happy"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {isEvolution && (
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-50 rounded-full animate-pulse" />
          )}

          <div className={`
            w-48 h-48 rounded-full shadow-xl flex items-center justify-center relative border-4 border-white z-10 overflow-hidden
            ${isEvolution ? 'bg-gradient-to-tr from-yellow-300 to-amber-500 shadow-[0_0_50px_rgba(250,204,21,0.6)]' : 
              isSad ? 'bg-gradient-to-tr from-indigo-400 to-blue-500' : 
              'bg-gradient-to-tr from-emerald-300 to-green-400'}
          `}>
            <img 
              src={getAvatarImage()} 
              alt="Avatar" 
              className={`w-full h-full object-cover ${isSad ? 'grayscale' : ''}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-white text-4xl">Dolly</span>';
              }}
            />
          </div>

          {isEvolution && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white font-bold px-4 py-1 rounded-full text-sm whitespace-nowrap shadow-lg border-2 border-white z-20">
              <Crown className="inline-block w-4 h-4 mr-1" />
              LUXURIOUS EVOLVED
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 新しく追加した「達成日数」の表示エリア */}
      <div className="mt-8 flex gap-4">
        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-2xl font-bold text-sm shadow-sm">
          <span>🔥 連続達成 {streak} 日</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl font-bold text-sm shadow-sm">
          <span>📅 通算達成 {totalDays} 日</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-md border-2 border-white/50 min-w-[140px]">
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Today</p>
            <p className={`text-4xl font-bold ${todayPoints < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {todayPoints > 0 ? '+' : ''}{todayPoints}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-md border-2 border-white/50 min-w-[140px]">
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Total</p>
            <p className="text-4xl font-bold text-slate-800">
              {totalPoints}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}