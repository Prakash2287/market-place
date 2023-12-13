import { schemaValidationForAuthentication } from "../app/validators/account-credential-validator";
import { publicProcedure, router } from "./trpc";
import getPayLoad from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
export const authRouter = router({
  createPayLoadUser: publicProcedure
    .input(schemaValidationForAuthentication)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayLoad();
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });
      if (users.length !== 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }
      await payload?.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });
      return { success: true, sentToEmail: email };
      //   Once the creation of the user was successful we are returning the email and success as true
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;
      const payload = await getPayLoad();
      const isVerified = payload.verifyEmail({
        collection: "users",
        token,
      });
  
      if (!isVerified)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      return { success: true };
    }),
    SignIn:publicProcedure.input(schemaValidationForAuthentication).mutation(async ({input,ctx})=>{
      const {res}=ctx;
      const {email,password}=input
      const payload=await getPayLoad();
      try {
        await payload.login({
          collection:'users',
          data:{
            email,
            password,
          },
          res
        })
        return {success:true}
      } catch (error) {
        throw new TRPCError({code:'UNAUTHORIZED'})
      }
    })
});
