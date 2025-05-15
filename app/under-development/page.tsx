import { MilestoneIcon, GitBranchIcon } from "lucide-react";

import CommitsTimeline from "@/components/commits-timeline";
import MilestonesTimeline from "@/components/milestones-timeline";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UnderDevelopmentPage() {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
          <TabsTrigger
            value="tab-1"
            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            <MilestoneIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Progresso
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            <GitBranchIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Histórico
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <MilestonesTimeline />
      </TabsContent>
      <TabsContent value="tab-2">
        <CommitsTimeline />
      </TabsContent>
    </Tabs>
  );
}
