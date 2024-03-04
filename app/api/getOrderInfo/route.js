import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Forbidden', {
      status: 403,
    });
  }

  //const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: true, // Include the orders relationship
    },
  });

    // const orders = await prisma.order.findMany({
    // });

    

  if (user && user.activeOrderId && user.orders) {
    return new NextResponse(JSON.stringify({ orders: user.orders }));
  } else {
    return new NextResponse(JSON.stringify({ orders: null }));
  }
}
