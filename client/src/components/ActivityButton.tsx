import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Loader2 } from "lucide-react";

interface ActivityButtonProps {
  name: string;
  points: number;
  onClick: () => void;
  isPending?: boolean;
}

export function ActivityButton({ name, points, onClick, isPending }: ActivityButtonProps) {
  const isPositive = points > 0;

  const baseClasses = "relative overflow-hidden group w-full p-4 rounded-3xl font-display font-bold text-lg text-white shadow-playful transition-all duration-200 hover:shadow-playful-hover flex flex-col items-center justify-center gap-2 outline-none focus:ring-4 focus:ring-offset-2";
  
  const colorClasses = isPositive 
    ? "bg-gradient-to-br from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 focus:ring-teal-200" 
    : "bg-gradient-to-br from-rose-400 to-orange-500 hover:from-rose-300 hover:to-orange-400 focus:ring-rose-200";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isPending}
      className={`${baseClasses} ${colorClasses} ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {isPending ? (
        <Loader2 className="w-8 h-8 animate-spin" />
      ) : (
        <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm ${isPositive ? 'text-emerald-50' : 'text-rose-50'}`}>
          {isPositive ? <Plus className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
        </div>
      )}
      
      <span className="relative z-10 text-center leading-tight">
        {name}
        <span className="block text-sm opacity-90 font-medium mt-1">
          ({points > 0 ? '+' : ''}{points})
        </span>
      </span>
    </motion.button>
  );
}
