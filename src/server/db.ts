import { PrismaClient, PostType } from "@prisma/client";

export const db = { table: new PrismaClient(), postType: PostType };
