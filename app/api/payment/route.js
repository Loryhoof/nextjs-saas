import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import Stripe from "stripe";

export async function POST (request) {

    const body = await request.json();
    const { stripeID } = body;

    console.log(stripeID);

    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Forbidden", {
            status: 403,
        });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // let priceId = "price_1NURdaKOqSRnpfUeVIr9Kbz5";
    const stripeSession = await stripe.checkout.sessions.create({
        metadata: {
            order_id: stripeID,
        },
        line_items: [
            {
                price: stripeID,
                quantity: 1,
            },
        ],
        mode: "payment",
        customer_email: session.user.email,
        success_url: "https://www.nextjssaassite.com/thankyou",
        cancel_url: "https://www.nextjssaassite.com/add",
    });

    return NextResponse.json(stripeSession.url);
}
