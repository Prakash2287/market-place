import { z } from "zod";

export const QueryValidator=z.object({
    category:z.string().optional(),
    sort:z.enum(['asc','desc']).optional(),
    limit:z.number().optional(),
})

export type TQueryValidator=z.infer<typeof QueryValidator>;

// z.infer can be used to create a type using a schema using typescript