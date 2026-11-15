import { query } from "./_generated/server";

// Return all categories with their tasks, each in display order.
export const getCategories = query({
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
        const completedTasks = user
            ? await ctx.db
                .query("completedTasks")
                .withIndex("by_user", (q) => q.eq("user", user._id))
                .collect()
            : [];
        const completedTaskIds = new Set(
            completedTasks.flatMap((completion) => completion.task ? [completion.task] : []),
        );
        const categories = await ctx.db.query("categories").collect();

        return await Promise.all(
            categories
                .sort((a, b) => a.order - b.order)
                .map(async (category) => ({
                    ...category,
                    tasks: await ctx.db
                        .query("tasks")
                        .withIndex("by_category_order", (q) =>
                            q.eq("category", category._id),
                        )
                        .collect()
                        .then((tasks) => tasks.map((task) => ({
                            ...task,
                            checked: completedTaskIds.has(task._id),
                        }))),
                })),
        );
    },
});
