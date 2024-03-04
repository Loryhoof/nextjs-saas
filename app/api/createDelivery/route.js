import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb'

export const maxDuration = 100;

export async function POST(request) {

const body = await request.json();
const orderData = body;
  
const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse('Forbidden', {
      status: 403,
    });
  }

  try {

    if(orderData != null)
    {
      const updatedOrder = await prisma.order.update({
        where: { id: orderData.orderId },
        data: {
            deliveredItems: {
              set: orderData.urls,
            },
          },
      });

        return new Response(JSON.stringify({ urls: s3URLs }));
    }

    // throw new Error('File processing failed');
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}