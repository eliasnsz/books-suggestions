import {
  BookOpenIcon,
  type LucideIcon,
  MessageCircleIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";

import {
  Timeline,
  TimelineContent,
  TimelineItem,
} from "@/components/ui/timeline";
import dayjs from "dayjs";
import { emojify } from "node-emoji";
import { ScrollArea } from "./ui/scroll-area";

const items: {
  id: number;
  user: string;
  image: string;
  action: ActionType;
  date: Date;
}[] = [
  {
    id: 1,
    user: "Matt",
    image: "/avatar-40-02.jpg",
    action: "post",
    date: new Date(Date.now() - 59000), // 59 seconds ago
  },
  {
    id: 2,
    user: "Matt",
    image: "/avatar-40-02.jpg",
    action: "reply",
    date: new Date(Date.now() - 180000), // 3 minutes ago
  },
  {
    id: 3,
    user: "Matt",
    image: "/avatar-40-02.jpg",
    action: "edit",
    date: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: 4,
    user: "Matt",
    image: "/avatar-40-02.jpg",
    action: "create",
    date: new Date(Date.now() - 600000), // 10 minutes ago
  },
];

type ActionType = "post" | "reply" | "edit" | "create";

export const dynamic = "force-dynamic";

function getActionIcon(action: ActionType): LucideIcon {
  const icons: Record<ActionType, LucideIcon> = {
    post: BookOpenIcon,
    reply: MessageCircleIcon,
    edit: PencilIcon,
    create: PlusIcon,
  };
  return icons[action];
}

function getActionText(action: ActionType): string {
  const texts: Record<ActionType, string> = {
    post: "wrote a new post",
    reply: "replied to a comment",
    edit: "edited a post",
    create: "created a new project",
  };
  return texts[action];
}

export default async function CommitsTimeline() {
  const response = await fetch(
    "https://api.github.com/repos/eliasnsz/leia-ai/commits",
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

  const results: any[] = await response.json();

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground text-xs font-medium">
        Atividade recente
      </div>
      <ScrollArea className="h-[600px]">
        <Timeline className="divide-y">
          {results.map((result) => {
            return (
              <TimelineItem
                key={result.sha}
                step={result.sha}
                className="m-0! flex-row items-start gap-3 py-2.5!"
              >
                <img
                  src={result.author.avatar_url}
                  alt={result.author.login}
                  className="size-6 rounded-full"
                />
                <TimelineContent className="text-foreground">
                  <div className="flex items-baseline gap-2">
                    <h6 className="font-semibold">
                      {result.commit.author.name}
                    </h6>
                    <span className="text-muted-foreground text-xs">
                      {" "}
                      {dayjs(result.commit.author.date).fromNow()}
                    </span>
                  </div>
                  <div>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={result.html_url}
                      className="font-medium text-muted-foreground text-sm hover:underline"
                    >
                      {emojify(result.commit.message.split("\n")[0])}
                    </a>
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </ScrollArea>
    </div>
  );
}
