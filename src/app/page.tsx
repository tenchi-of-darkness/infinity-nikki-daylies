"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { useState } from "react";

const categories = [
  {
    title: "Daily rewards",
    tasks: [
      "Complete Daily Wishes",
      "Complete Starlit Moments",
      "Claim available login rewards",
      "Spend Vital Energy in a Realm"
    ],
  },
  {
    title: "Weekly rewards",
    tasks: [
      "Claim Realm of Breakthrough rewards (weekly)",
      "Complete Starlit Moments",
      "Claim available login rewards",
    ],
  },
  {
    title: "Gathering and exploration",
    tasks: [
      "Collect and restart Dig, Pear-Pal",
      "Purify Esselings",
      "Collect whimstars",
      "Collect dews",
      "Collect bling through exploring"
    ],
  },
  {
    title: "Special animal grooming",
    tasks: [
      "Astral swan",
      "Bullquet",
      "Dawn Fox",
      "Bibcoon",
      "Rosecrown Swan",
      "Tuxtail Swan",
      "Nela Bird (5x)",
      "Nightglow Wolf (12x)",
      "Frostbought Behemoth"
    ],
  },
  {
    title: "Home and crafting",
    tasks: [
      "Groom home animals small + big",
      "Harvest and replant crops + trees",
      "Use the momo fish ability to fish",
      "Grow and feed new fish",
      "Craft items at the workbench",
      "Collect astelerites at the tree",
      "Collect meteorites",
      "Cook food"
    ],
  },
  {
    title: "Optional",
    tasks: [
      "Play mini-games",
      "Take photos",
      "Check limited-time event tasks (Events shortcut windows = k)",
      "Upgrade an Eureka",
      "Craft clothing",
      "Collect fallen star and share with friends",
      "Pull on banners",
    ],
  },
];

export default function HomePage() {
  const [completed, setCompleted] = useState<string[]>([]);

  const allTasks = categories.flatMap((category) => category.tasks);
  const doneCount = completed.length;

  function toggleTask(task: string) {
    setCompleted((current) =>
      current.includes(task)
        ? current.filter((item) => item !== task)
        : [...current, task],
    );
  }

  return (
    <main className="min-h-screen bg-background font-[Arial,sans-serif] text-foreground">
      <div className="mx-auto max-w-[760px] px-6 py-12">
        <header className="mb-7">
          <p className="text-xs font-bold tracking-[0.15em] text-primary">
            INFINITY NIKKI
          </p>
          <h1 className="my-2 text-[clamp(32px,7vw,48px)] font-bold">
            Daily checklist
          </h1>
          <p className="text-muted-foreground">Keep track of your Miraland routine.</p>

          <Progress value={doneCount / allTasks.length * 100} className="my-6 mb-2 text-sm">
            <ProgressLabel>Upload progress</ProgressLabel>
            <ProgressValue />
          </Progress>

          <div className="flex justify-between">
            <p>
              {doneCount} of {allTasks.length} tasks complete
            </p>
            <Button
              onClick={() => setCompleted([])}
            >
              Clear checklist
            </Button>
          </div>

        </header>

        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="font-bold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid list-none gap-3">
                {category.tasks.map((task, index) => {
                  const isChecked = completed.includes(task);

                  return (
                    <div
                      key={task}
                      className={`flex cursor-pointer items-center gap-3 leading-[1.45] ${isChecked ? "text-muted-foreground line-through" : ""
                        }`}
                    >
                      <Checkbox
                        id={`checkbox-${category.title}-${index}`}
                        name={`checkbox-${category.title}-${index}`}
                        className="mt-px h-[18px] w-[18px]"
                        onCheckedChange={() => toggleTask(task)}
                        checked={isChecked}
                      />
                      <Label htmlFor={`checkbox-${category.title}-${index}`}>{task}</Label>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-6 text-[13px] text-muted-foreground">
          Tasks can change with updates and limited-time events.
        </footer>
      </div>
    </main>
  );
}
