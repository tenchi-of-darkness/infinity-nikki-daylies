import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

interface TaskModel {
    name: string,
    count?: number,
}

// Create a new task with the given text
export const seedDatabase = mutation({
    handler: async (ctx, args) => {
        const devUserToken = "dev-user";
        const devUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", devUserToken))
            .unique();
        const existingCategories = await ctx.db.query("categories").collect();

        if (devUser && existingCategories.length > 0) {
            return { seededUser: false, seededCategories: false };
        }

        if (!devUser) {
            await ctx.db.insert("users", {
                name: "Development User",
                tokenIdentifier: devUserToken,
            });
        }

        if (existingCategories.length > 0) {
            return { seededUser: !devUser, seededCategories: false };
        }

        const addTasks = async (categoryId: Id<"categories">, tasks: TaskModel[]) => {
            let i = 0;
            for (const task of tasks) {
                await ctx.db.insert("tasks", { category: categoryId, name: task.name, count: task.count, order: i++ })
            }
        }

        await addTasks(await ctx.db.insert("categories", { name: "Daily tasks", order: 0 }), [
            { name: "Complete Daily Wishes" },
            { name: "Complete Starlit Moments" },
            { name: "Claim available login rewards" },
            { name: "Spend Vital Energy in a Realm" },
        ]);

        await addTasks(await ctx.db.insert("categories", { name: "Weekly rewards", order: 1 }), [
            { name: "Claim Realm of Breakthrough rewards", count: 2 },
            { name: "Complete Starlit Pursuit courses", count: 3 },
            { name: "Battle in Miracrown Merit area", count: 3 },
        ]);

        await addTasks(await ctx.db.insert("categories", { name: "Monthly rewards", order: 2 }), [
            { name: "Claim pink crystals rewards (in the shop)", count: 5 },
            { name: "Claim blue crystals rewards (in the shop)", count: 5 },
        ]);

        await addTasks(await ctx.db.insert("categories", { name: "Gathering and exploration", order: 3 }), [
            { name: "Collect and restart Dig, Pear-Pal" },
            { name: "Purify Esselings" },
            { name: "Collect whimstars" },
            { name: "Collect dews" },
            { name: "Collect bling through exploring" },
        ]);

        await addTasks(await ctx.db.insert("categories", { name: "Special animal grooming", order: 4 }), [
            { name: "Astral swan" },
            { name: "Bullquet" },
            { name: "Dawn Fox" },
            { name: "Bibcoon" },
            { name: "Rosecrown Swan" },
            { name: "Tuxtail Swan" },
            { name: "Nela Bird", count: 3 },
            { name: "Nightglow Wolf", count: 12 },
            { name: "Frostbought Behemoth" },
        ]);

        await addTasks(await ctx.db.insert("categories", { name: "Home and crafting", order: 5 }), [
            { name: "Groom home animals small + big" },
            { name: "Harvest and replant crops + trees" },
            { name: "Use the momo fish ability to fish" },
            { name: "Grow and feed new fish" },
            { name: "Craft items at the workbench" },
            { name: "Collect astelerites at the tree" },
            { name: "Collect meteorites" },
            { name: "Cook food" },
        ]);

        await addTasks(await ctx.db.insert("categories", { name: "Optional", order: 6 }), [
            { name: "Play mini-games" },
            { name: "Take photos" },
            { name: "Check limited-time event tasks (Events shortcut windows = k)" },
            { name: "Upgrade an Eureka" },
            { name: "Craft clothing" },
            { name: "Collect fallen star and share with friends" },
            { name: "Pull on banners" },
        ]);

        return { seededUser: !devUser, seededCategories: true };
    },
});

