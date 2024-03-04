import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const session = await getServerSession(authOptions);

  const { orderId } = await request.json();

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse('Forbidden', {
      status: 403,
    });
  }

  try {

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true
      }
    });

    const updatedChatId = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'delivered',
      },
    });

    const data = await resend.emails.send({
      from: 'NextJS SaaS <hello@nextjssaassite.com>',
      to: order.user.email,
      subject: "Your order has been delivered!",
      html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center;">Your Order Has Been Delivered!</h1>
            <p style="color: #555; text-align: center; font-size: 16px;">Dear Customer,</p>
            <p style="color: #555; text-align: center;">We're excited to let you know that your order has been successfully delivered!</p>
            <p style="color: #555; text-align: center;">You can view your orders <a href="https://www.nextjssaassite.com/dashboard/orders" style="color: #007bff; text-decoration: none;">here</a>.</p>
            <p style="color: #555; text-align: center;">Thank you for choosing NextJS SaaS!</p>
            <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
            <p style="color: #888; text-align: center; font-size: 12px;">This is an automated email. Please do not reply.</p>
          </div>
        `,
      });

      console.log("email sent", data, "email sent")

    return new NextResponse(JSON.stringify({status: 200}));
  } catch (error) {
    console.error('Error:', error);
    //return new NextResponse.json({ success: false, error: error.message });
  }
}
