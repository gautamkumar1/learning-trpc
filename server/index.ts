import { router } from "./trpc.js";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { Todo, User } from "./schema/schema.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { connectDB } from "./utils/db.js";
import { userRouter } from "./router/user.js";
connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
const appRouter = router({
    user: userRouter,
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