import getPayLoad from "../get-payload";
import { QueryValidator } from "../lib/query-validator";
import { authRouter } from "./auth-router";
import paymentRouter from "./payment-router";
import { publicProcedure, router } from "./trpc";
import z from "zod";

export const appRouter = router({
  auth: authRouter,
  payment:paymentRouter,
  // here authRouter is also a router so we have defined a router within a router
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit, ...queryOpts } = query;
      const payload = await getPayLoad();
      const parsedQueryOptions: Record<string, { equals: string }> = {};
      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOptions[key] = {
          equals: value,
        };
      });
      const page = cursor || 1;
      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOptions,
        },
        sort,
        depth: 1,
        limit,
        page,
      });
      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});
export type AppRouter = typeof appRouter;
// The appRouter is basically the backend that we will pass to the client.ts file
