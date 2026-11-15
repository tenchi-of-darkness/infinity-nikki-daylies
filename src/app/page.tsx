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
import { Progress, ProgressLabel, ProgressValue, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomePage() {
  const categories = useQuery(api.queries.getCategories, {})

  const toggleTask = useMutation(api.mutations.toggleTask)

  const resetTasks = useMutation(api.mutations.resetTasks)

  const allTasks = categories?.flatMap(c => c.tasks) ?? [];

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

          <Progress value={allTasks.filter(t => t.checked).length / allTasks.length * 100} className="my-6 mb-2">
            <ProgressLabel className={"text-md"}>Completion</ProgressLabel>
            <ProgressValue className={"text-md"} />
          </Progress>

          <div className="flex justify-between">
            <p>
              {allTasks.filter(t => t.checked).length} of {allTasks.length} tasks complete
            </p>
            <Button
              onClick={() => resetTasks({})}
            >
              Clear checklist
            </Button>
          </div>

        </header>

        <div className="grid gap-4">
          {categories?.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle className="font-bold">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid list-none gap-3">
                <Progress value={(category.tasks.filter(x => x.checked).length) / category.tasks.length * 100} className="mb-2 text-sm">
                  <ProgressLabel>Completion</ProgressLabel>
                  <ProgressValue />
                </Progress>
                {category.tasks.map((task, index) => {
                  return (
                    <div
                      key={task.name}
                      className={`flex cursor-pointer items-center gap-3 leading-[1.45] ${task.checked ? "text-muted-foreground line-through" : ""}`}
                    >
                      <Checkbox
                        id={`checkbox-${category.name}-${index}`}
                        name={`checkbox-${category.name}-${index}`}
                        className="mt-px h-[18px] w-[18px]"
                        onCheckedChange={async () => {
                          await toggleTask({ taskId: task._id })
                        }}
                        checked={task.checked}
                      />
                      <Label htmlFor={`checkbox-${category.name}-${index}`}>{task.name}</Label>
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
