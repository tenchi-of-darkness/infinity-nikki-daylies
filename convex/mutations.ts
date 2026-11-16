import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getOrCreateCurrentUser } from "./userHelpers";

export const ensureCurrentUser = mutation({
    handler: async (ctx) => {
        const user = await getOrCreateCurrentUser(ctx);
        return user?._id;
    },
});

// Return all categories with their tasks, each in display order.
export const toggleTask = mutation({
    args: {
        taskId: v.id("tasks"),
        checked: v.boolean(),
    },
    handler: async (ctx, args) => {
        const user = await getOrCreateCurrentUser(ctx);
        if (!user) throw new Error("Could not create the signed-in user.");

        const completions = await ctx.db
            .query("completedTasks")
            .withIndex("by_user_task", (q) =>
                q.eq("user", user._id).eq("task", args.taskId),
            )
            .collect();

        if (!args.checked && completions.length > 0) {
            await Promise.all(completions.map((completion) => ctx.db.delete(completion._id)));
        } else if (args.checked && completions.length === 0) {
            await ctx.db.insert("completedTasks", { user: user._id, task: args.taskId });
        }

    },
});

export const resetTasks = mutation({
    handler: async (ctx, args) => {
        const user = await getOrCreateCurrentUser(ctx);
        if (!user) throw new Error("Could not create the signed-in user.");

        const allCompletedTasks = await ctx.db.query("completedTasks").withIndex("by_user", (q) => q.eq("user", user._id)).collect();

        for (const task of allCompletedTasks) {
            await ctx.db.delete("completedTasks", task._id)
        }
    },
})
