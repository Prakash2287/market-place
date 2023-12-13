// This accepts the products that are in the cart and then creates a unique url so that a new session can be created and then redirects the user to the url for payment
import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import getPayLoad from "../get-payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";
// we need to create a private procedure for this
const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;
      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const payload = await getPayLoad();
      //   in the schema we have created that we are also going to create a unique stripe id so we are going to use that
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });
      const filteredProducts = products.filter((prod: any) =>
        Boolean(prod.priceId)
      );
      //   Checking only those products that have a productId are being passed only

      //   Here we are creating the order for the backend
      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod: any) => prod.id),
          user: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      line_items.push({
        price: "price_1OMY7WSAvmiRlRyk6Jy8T2ZD",
        quantity: 1,
        adjustable_quantity: {
          enabled: true,
        },
      });
      products.forEach((prod: any) => {
        line_items.push({
          price: prod.priceId,
          quantity: 1,
        });
      });
      //   line_items are those for those we are going to place the order for
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });
        return {
          url: stripeSession.url,
        };
      } catch (err) {
        console.log(err);
        return {
          url: null,
        };
      }
    }),
    pullOrderStatus:publicProcedure.input(z.object({orderId:z.string()})).query(async ({input})=>{
      const {orderId}=input;
      const payload=await getPayLoad();
      const {docs:orders}=await payload.find({
        collection:"orders",
        where:{
          id:{
            equals:orderId,
          }
        }
      })
      if(!orders){
        throw new TRPCError({code:'NOT_FOUND'});
      }
      const [order]=orders;
      return {isPaid:order._isPaid}
    })
});
export default paymentRouter;
