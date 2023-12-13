const express=require("express");
const app=express();
const PORT=Number(process.env.PORT) || 3000;
import getPayLoad from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import bodyParser from "body-parser"
import { stripeWebHookHandler } from "./StripeWebHookHandler";
export type ExpressContext=inferAsyncReturnType<typeof createContext>
const createContext=({req,res}:trpcExpress.CreateExpressContextOptions)=>({
    req,res,
})
export type WebHookRequest=IncomingMessage & {rawBody:Buffer}



const start=async()=>{
    // we can config generally where stripe is going to send the payment success to the server this can be done using a custom middleware that handles it
    const webHookMiddleware=bodyParser.json({
        verify:(req:WebHookRequest,_,buffer)=>{
            req.rawBody=buffer
        }
    })
    app.post('/api/webhooks/stripe',webHookMiddleware,stripeWebHookHandler)



    const payload=await getPayLoad({
        initOptions:{
            express:app,
            onInit:async(cms)=>{
                cms.logger.info(`Admin URL ${cms.getAdminURL}`)
            }
        }
    })
    app.use('/api/trpc',trpcExpress.createExpressMiddleware({
        router:appRouter,
        createContext
    }))
    app.use((req:any,res:any)=>nextHandler(req,res));

    nextApp.prepare().then(()=>{
        app.listen(PORT,async()=>{
            console.log(`Listening on the port ${PORT}`);
        })
    })

}

start();

// we need to listen to the stripe webhook as well to know if the payment was successful or not