import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    categories: defineTable({
        name: v.string(),
        order: v.number(),
    }),
    tasks: defineTable({
        name: v.string(),
        count: v.number().optional(),
        order: v.number(),
        category: v.id("categories")
    }).index("by_category_order", ["category", "order"]),
    completedTasks: defineTable({
        user: v.id("users"),
        task: v.id("tasks"),
    })
        .index("by_user", ["user"])
        .index("by_user_task", ["user", "task"]),
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
