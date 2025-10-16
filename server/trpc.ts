import { initTRPC } from '@trpc/server';
import  { Todo, User } from './schema/schema.js';
import type { JwtPayload } from 'jsonwebtoken';

const t = initTRPC.context<{db: {Todo: typeof Todo, User: typeof User}; userId?: JwtPayload | string;}>().create();


export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;