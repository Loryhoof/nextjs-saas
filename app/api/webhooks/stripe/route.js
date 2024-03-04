import Stripe from "stripe";
import { headers } from "next/dist/client/components/headers";
import prisma from "../../../libs/prismadb";


export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const productList = [
    {id: process.env.PRODUCT_1, name:'SMALL'},
    {id: process.env.PRODUCT_2, name:'LARGE'},
    {id: process.env.PRODUCT_3, name:'ALL'},
  ]

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
        const userEmail = session.customer_email;

        const orderID = session.metadata.order_id;

        const product = productList.find(item => item.id === orderID);

         const user = await prisma.user.findUnique({ where: { email: userEmail } });

        if (user) {
            const newOrder = await prisma.order.create({
              data: {
                userId: user.id,
                status: "created",
                package: product.name,
              },
            });

            const updatedUser = await prisma.user.update({
              where: { email: userEmail },
              data: {
                activeOrderId: newOrder.id,
                orderStep: "upload"
              },
            });       
        }
    }

  return new Response(null, { status: 200 });
}


