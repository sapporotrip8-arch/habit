import { useActivities } from "@/hooks/use-activities";
import { useSummary } from "@/hooks/use-summary";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { RecentLogs } from "@/components/RecentLogs";
import { ActivityButton } from "@/components/ActivityButton";
import { ManageActivities } from "@/components/ManageActivities";
import { StreakHeader } from "@/components/StreakHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, PlusCircle } from "lucide-react";

export default function Home() {
  const { data: activities = [], isLoading: actLoading } = useActivities();
  const summary = useSummary();

  if (actLoading || summary.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] pb-20">
      <StreakHeader />

      <div className="mx-auto max-w-2xl space-y-8 pt-20 px-4">
        
        {/* アバターを中央に配置 */}
        <div className="flex justify-center">
          <AvatarDisplay />
        </div>

        {/* スコア表示 */}
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

        {/* 記録用ドロワーの起動セクション */}
        <section className="space-y-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                size="lg" 
                className="w-full h-16 rounded-2xl shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold gap-3 text-lg transition-all active:scale-[0.98]"
              >
                <PlusCircle className="h-6 w-6" />
                できた事を記録する
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-slate-50 max-h-[85vh]">
              <DrawerHeader className="border-b border-slate-100 bg-white/50">
                <DrawerTitle className="text-center text-slate-800">何ができましたか？</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="p-6">
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {activities.length > 0 ? (
                    activities.map((activity: any) => (
                      <ActivityButton key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-10 text-center col-span-2">
                      「項目のカスタマイズ」から追加してください
                    </p>
                  )}
                </div>
              </ScrollArea>
              <DrawerFooter className="border-t border-slate-100 bg-white p-4">
                <DrawerClose asChild>
                  <Button variant="ghost" className="w-full font-medium text-slate-500">閉じる</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 最近の記録（5件）を記録ボタンの下に配置 */}
          <RecentLogs />
        </section>

        <ManageActivities />
      </div>
    </div>
  );
}
