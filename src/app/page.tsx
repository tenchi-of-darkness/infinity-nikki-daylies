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
import { useState } from "react";

const categories = [
  {
    title: "Daily rewards",
    tasks: [
      "Complete Daily Wishes",
      "Complete Starlit Moments",
      "Claim available login rewards",
    ],
  },
  {
    title: "Energy and realms",
    tasks: [
      "Spend Vital Energy in a Realm",
      "Claim Realm of Breakthrough rewards (weekly)",
    ],
  },
  {
    title: "Gathering and exploration",
    tasks: [
      "Collect and restart Dig, Pear-Pal",
      "Gather materials for crafting or Daily Wishes",
      "Purify Esselings if needed",
    ],
  },
  {
    title: "Home and crafting",
    tasks: [
      "Collect ready home resources",
      "Replant crops or restart production",
      "Craft clothing or upgrade a Eureka if needed",
    ],
  },
  {
    title: "Optional",
    tasks: [
      "Play mini-games or take photos for a Daily Wish",
      "Check limited-time event tasks",
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
    <main className="min-h-screen bg-[#faf7fb] font-[Arial,sans-serif] text-[#322b36]">
      <div className="mx-auto max-w-[760px] px-6 py-12">
        <header className="mb-7">
          <p className="text-xs font-bold tracking-[0.15em] text-[#92709f]">
            INFINITY NIKKI
          </p>
          <h1 className="my-2 text-[clamp(32px,7vw,48px)] font-bold">
            Daily checklist
          </h1>
          <p className="text-[#706875]">Keep track of your Miraland routine.</p>

          <div
            className="my-6 mb-2 flex items-center justify-between text-sm"
            aria-live="polite"
          >
            <span>
              {doneCount} of {allTasks.length} tasks complete
            </span>
            <Button
              className="cursor-pointer border-0 bg-transparent text-[#79528b] underline"
              onClick={() => setCompleted([])}
            >
              Clear checklist
            </Button>
          </div>
          <progress
            className="h-2.5 w-full accent-[#a77db8]"
            value={doneCount}
            max={allTasks.length}
          />
        </header>

        <div className="grid gap-4">
          {categories.map((category) => (
            <Card className="bg-white" key={category.title}>
              <CardHeader>
                <CardTitle className="font-bold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid list-none gap-3">
                {category.tasks.map((task, index) => {
                  const isChecked = completed.includes(task);

                  return (
                    <div
                      key={task}
                      className={`flex cursor-pointer items-center gap-3 leading-[1.45] ${isChecked ? "text-[#928b96] line-through" : ""
                        }`}
                    >
                      <Checkbox
                        id={`checkbox-${index}`}
                        name={`checkbox-${index}`}
                        className="mt-px h-[18px] w-[18px] accent-[#9c6eae]"
                        onCheckedChange={() => toggleTask(task)}
                        checked={isChecked}
                      />
                      <Label htmlFor={`checkbox-${index}`}>{task}</Label>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-6 text-[13px] text-[#817985]">
          Tasks can change with updates and limited-time events.
        </footer>
      </div>
    </main>
  );
}
