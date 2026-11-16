import type { MutationCtx } from "./_generated/server";

export async function getOrCreateCurrentUser(ctx: MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    const isLocalDev = ["http://127.0.0.1:", "http://localhost:"]
        .some((localUrl) => process.env.CONVEX_CLOUD_URL?.startsWith(localUrl));
    const tokenIdentifier = identity?.tokenIdentifier ?? (isLocalDev ? "dev-user" : null);

    if (!tokenIdentifier) {
        throw new Error("You must be signed in to use this action.");
    }

    const existingUser = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();
    if (existingUser) return existingUser;

    const userId = await ctx.db.insert("users", {
        name: identity?.name ?? identity?.email ?? identity?.subject ?? "User",
        tokenIdentifier,
    });
    return await ctx.db.get(userId);
}
