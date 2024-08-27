import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        text: z.string().optional(),
        file: z.string().optional(),
        fileType: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let type: any = ctx.db.postType.TEXT;

      if (input.fileType === "image") {
        type = ctx.db.postType.IMAGE;
      }
      if (input.fileType === "video") {
        type = ctx.db.postType.VIDEO;
      }

      await ctx.db.table.post.create({
        data: {
          file: input.file,
          type: type,
          text: input.text,
          user: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });

      return true;
    }),

  deletePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.table.post.delete({
        where: {
          id: input.postId,
        },
      });

      return true;
    }),

  getHomePosts: protectedProcedure.query(async ({ ctx, input }) => {
    const posts = await ctx.db.table.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: ctx.session.user.id,
            },
          },
        },
      },
      select: {
        id: true,
        text: true,
        type: true,
        file: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  }),
  getExplorePosts: protectedProcedure.query(async ({ ctx, input }) => {
    const posts = await ctx.db.table.post.findMany({
      select: {
        id: true,
        file: true,
      },
      where: {
        type: ctx.db.postType.IMAGE,
      },
    });

    return posts;
  }),
  getPostsByUserName: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.table.post.findMany({
        where: {
          user: {
            name: input.name,
          },
        },
        select: {
          id: true,
          text: true,
          type: true,
          file: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return posts;
    }),
});
