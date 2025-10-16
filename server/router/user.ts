import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { isLoggedIn } from '../middleware/user-middleware.js';
export const userRouter = router({
  signup: publicProcedure.input(z.object({
    username: z.string(),
    password: z.string(),
  })).mutation(async({input, ctx}) => {
    const { username, password } = input;
    const existingUser = await ctx.db.User.findOne({ username });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = await ctx.db.User.create({ username, password });
    const token = jwt.sign({ userId: user._id }, 'secret');
    console.log(token);
    return { token };
  }),
  login: publicProcedure.input(z.object({
    username: z.string(),
    password: z.string(),
  })).mutation(async({input, ctx}) => {
    const { username, password } = input;
    const user = await ctx.db.User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, 'secret');
    return { token };
  }),
  me: publicProcedure
  .use(isLoggedIn)
  .query(async({ctx}) => {
    const user = await ctx.db.User.findById(ctx.userId);
    return { username: user?.username };
  })
});