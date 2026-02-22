import { Button } from "@/components/ui/button";
import { useCreateLog } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function ActivityButton({ activity }: { activity: any }) {
  const { mutate, isPending } = useCreateLog();
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      size="lg"
      className="h-32 w-48 flex-col gap-2 bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-none hover:opacity-90 active:scale-95 transition-all"
      disabled={isPending}
      onClick={() => {
        mutate(activity.id, {
          onSuccess: () => {
            toast({ title: `${activity.name}を記録しました！` });
          }
        });
      }}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <div className="text-2xl">＋</div>}
      <div className="font-bold">{activity.name}</div>
      <div className="text-xs opacity-80">(+{activity.points || 0})</div>
    </Button>
  );
}
