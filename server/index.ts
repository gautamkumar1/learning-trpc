import { publicProcedure, router } from "./trpc.js";
import { z } from "zod";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { Todo, User } from "./schema/schema.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { connectDB } from "./utils/db.js";
const TodoInput = z.object({
    title: z.string(),
    description: z.string(),
})
connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
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
const SECRET = 'secret';
const server = createHTTPServer({
    router: appRouter,
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];

        if (authHeader) {
            const token = authHeader.split(' ')[1] as string;
            console.log(token);
            return new Promise<{db: {Todo: typeof Todo, User: typeof User}, userId?: JwtPayload | string}>((resolve) => {
                jwt.verify(token, SECRET, (err, user) => {
                    if (user) {
                        resolve({userId: user as JwtPayload | string, db: {Todo, User}});
                    } else {
                        resolve({db: {Todo, User}});
                    }
                });
            })
        }

        return {
            db: {Todo, User},
        }
    }
  });
   
server.listen(3000);
export type AppRouter = typeof appRouter;