import dayjs from "dayjs";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { CheckIcon } from "lucide-react";
import { Progress } from "./ui/progress";

export const dynamic = "force-dynamic";

export default async function MilestonesTimeline() {
  const response = await fetch(
    "https://api.github.com/repos/eliasnsz/leia-ai/milestones?state=all",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error();
  }

  const milestones: any[] = await response.json();

  const currentMilestoneIndex = milestones.findIndex(
    (milestone) => milestone.state === "open",
  );

  const currentMilestone = milestones[currentMilestoneIndex];
  const currentMilestoneProgressPercent = Math.floor(
    (currentMilestone.closed_issues /
      (currentMilestone.closed_issues + currentMilestone.open_issues)) *
      100,
  );

  return (
    <Timeline value={currentMilestoneIndex}>
      {milestones.map((milestone, index) => (
        <TimelineItem
          key={milestone.id}
          step={milestone.number}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader className="">
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineDate>
              Criado em{" "}
              {dayjs(milestone.created_at).format("DD [de] MMMM [de] YYYY")}
            </TimelineDate>

            <TimelineTitle>{milestone.title}</TimelineTitle>
            <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
              <CheckIcon
                className="group-not-data-completed/timeline-item:hidden"
                size={16}
              />
            </TimelineIndicator>
          </TimelineHeader>

          <TimelineContent>{milestone.description}</TimelineContent>

          <div
            data-is-current-milestone={index === currentMilestoneIndex}
            className="flex gap-2 mt-1 items-center not-data-[is-current-milestone=true]:hidden"
          >
            <Progress
              className="max-w-[200px]"
              value={currentMilestoneProgressPercent}
            />
            <span className="text-xs font-semibold">{`${currentMilestoneProgressPercent}%`}</span>
          </div>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
