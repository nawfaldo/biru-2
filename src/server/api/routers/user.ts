import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ name: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const error: AuthInputError = {};

      const userWithSameName = await ctx.db.table.user.findUnique({
        where: { name: input.name },
        select: {
          name: true,
        },
      });

      if (userWithSameName) {
        error.name = "User with that name already exists";
      }

      if (error.name !== undefined) {
        throw new TRPCError({
          code: "CONFLICT",
          message: JSON.stringify(error),
        });
      }

      await ctx.db.table.user.create({
        data: {
          name: input.name,
          password: input.password,
        },
        select: null,
      });
    }),
  getUsersByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.table.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
        select: {
          name: true,
        },
      });

      return users;
    }),
  getUserProfileByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.table.user.findUnique({
        select: {
          id: true,
          name: true,
        },
        where: {
          name: input.name,
        },
      });

      if (!profile) {
        throw new Error("User not found");
      }

      const postCount = await ctx.db.table.post.count({
        where: {
          userId: profile.id,
        },
      });

      const followerCount = await ctx.db.table.follows.count({
        where: {
          followingId: profile.id,
        },
      });

      const followingCount = await ctx.db.table.follows.count({
        where: {
          followerId: profile.id,
        },
      });

      const checkFollowing = await ctx.db.table.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: profile.id,
          },
        },
      });

      const isFollowing = !!checkFollowing;

      return { profile, postCount, followerCount, followingCount, isFollowing };
    }),
  follow: protectedProcedure
    .input(z.object({ userID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.table.follows.create({
        data: {
          followerId: ctx.session.user.id,
          followingId: input.userID,
        },
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ userID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.table.follows.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: input.userID,
          },
        },
      });
    }),
});
