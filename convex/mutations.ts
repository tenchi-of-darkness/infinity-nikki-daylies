import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Return all categories with their tasks, each in display order.
export const toggleTask = mutation({
    args: {
        taskId: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const isLocalDev = ["http://127.0.0.1:", "http://localhost:"]
            .some((localUrl) => process.env.CONVEX_CLOUD_URL?.startsWith(localUrl));
        const tokenIdentifier = identity?.tokenIdentifier ??
            (isLocalDev ? "dev-user" : null);
        const user = tokenIdentifier
            ? await ctx.db
                .query("users")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
                .unique()
            : null;

        if (user === null) {
            throw new Error("No user is available. In development, run the seed mutation first.");
        }

        const completions = await ctx.db
            .query("completedTasks")
            .withIndex("by_user_task", (q) =>
                q.eq("user", user._id).eq("task", args.taskId),
            )
            .collect();

        if (completions.length > 0) {
            await Promise.all(completions.map((completion) => ctx.db.delete(completion._id)));
        } else {
            await ctx.db.insert("completedTasks", { user: user._id, task: args.taskId });
        }

    },
});

export const resetTasks = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const isLocalDev = ["http://127.0.0.1:", "http://localhost:"]
            .some((localUrl) => process.env.CONVEX_CLOUD_URL?.startsWith(localUrl));
        const tokenIdentifier = identity?.tokenIdentifier ??
            (isLocalDev ? "dev-user" : null);
        const user = tokenIdentifier
            ? await ctx.db
                .query("users")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
                .unique()
            : null;

        if (user === null) {
            throw new Error("No user is available. In development, run the seed mutation first.");
        }

        const allCompletedTasks = await ctx.db.query("completedTasks").withIndex("by_user", (q) => q.eq("user", user._id)).collect();

        for (const task of allCompletedTasks) {
            await ctx.db.delete("completedTasks", task._id)
        }
    },
})
