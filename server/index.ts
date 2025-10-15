import { publicProcedure, router } from "./trpc.js";
import { z } from "zod";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
const TodoInput = z.object({
    title: z.string(),
    description: z.string(),
})
const appRouter = router({
    createToDo: publicProcedure.input(TodoInput)
    .mutation(async({input})=>{
        const title = input.title;
        const description = input.description;
        // do some db stuffs
        return {
            id: 1,
        }
    })
})
const server = createHTTPServer({
    router: appRouter,
  });
   
server.listen(3000);
export type AppRouter = typeof appRouter;