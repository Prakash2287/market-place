// to handle api requests we need to name the page route.ts by default
import { appRouter } from "@/trpc";
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';

const requestHandler=(req:Request)=>{
    fetchRequestHandler({
        endpoint:'/api/trpc',
        req,
        router:appRouter,
        //@ts-expect-error this type has already been defined so no issue here
        createContext:()=>({})
    })
}
export {requestHandler as GET, requestHandler as POST};

// exporting the handler as both get and post handlers