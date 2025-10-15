import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/index.js';
//     👆 **type-only** import
 
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

async function main() {
    console.log('Creating todo');
    
    const result = await trpc.createToDo.mutate({
        title: 'Buy groceries',
        description: 'Buy groceries from the store',
    });
    console.log(result);
}

main();