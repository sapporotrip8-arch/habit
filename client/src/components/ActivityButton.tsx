import { Button } from "@/components/ui/button";
import { useCreateLog } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function ActivityButton({ activity }: { activity: any }) {
  const { mutate, isPending } = useCreateLog();
  const { toast } = useToast();

  if (!activity) return null;

  // ポイントがマイナスかどうかを判定
  const isNegative = activity.points < 0;

  // ボタンの色を決定（プラスは緑系、マイナスはピンク系）
  const buttonColor = isNegative
    ? "from-rose-400 to-pink-500"
    : "from-emerald-400 to-teal-500";

  // ポイントの表記を調整
  const displayPoints = activity.points > 0 
    ? `(+${activity.points})` 
    : `(${activity.points})`;

  return (
    <Button
      variant="outline"
      size="lg"
      // 高さを h-32 から h-24 に縮小、幅を w-full に変更
      className={`h-24 w-full flex-col gap-1 bg-gradient-to-br ${buttonColor} text-white border-none hover:opacity-90 active:scale-95 transition-all px-2`}
      disabled={isPending}
      onClick={() => {
        mutate(activity.id, {
          onSuccess: () => {
            // ポイントに応じて表示メッセージを切り替え
            let message = `${activity.name}を記録しました！`;
            if (activity.points > 0) {
              message = "夢が近づいた";
            } else if (activity.points < 0) {
              message = "おっと　でもきっと大丈夫だよね？";
            }
            
            toast({ title: message });
          }
        });
      }}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="text-xl font-bold">{isNegative ? "ー" : "＋"}</div>
      )}
      <div className="font-bold text-sm truncate w-full px-1">{activity.name}</div>
      <div className="text-[10px] opacity-80">{displayPoints}</div>
    </Button>
  );
}
