import { useActivities } from "@/hooks/use-activities";
import { useSummary } from "@/hooks/use-summary";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { ActivityButton } from "@/components/ActivityButton";
import { ManageActivities } from "@/components/ManageActivities";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: activities, isLoading: actLoading } = useActivities();
  const summary = useSummary(); // data ではなく直接 summary を受け取る形に調整

  if (actLoading || summary.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] p-4 pb-20">
      <div className="mx-auto max-w-2xl space-y-8 pt-8">
        <AvatarDisplay />
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</p>
              <p className="text-4xl font-black text-emerald-500">{summary.today}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-4xl font-black text-slate-700">{summary.total}</p>
            </CardContent>
          </Card>
        </div>
        <section className="space-y-4 text-center">
          <h2 className="text-lg font-bold text-slate-800">できた事を記録する</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {activities.length > 0 ? (
              activities.map((act) => <ActivityButton key={act.id} activity={act} />)
            ) : (
              <p className="text-sm text-muted-foreground py-10">項目を追加してください</p>
            )}
          </div>
        </section>
        <ManageActivities />
      </div>
    </div>
  );
}
