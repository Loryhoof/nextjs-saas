import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse('Forbidden', {
      status: 403,
    });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true
    }
  });

  if (orders) {
    return new NextResponse(JSON.stringify({ orders: orders }));
  } else {
    return new NextResponse(JSON.stringify({ orders: null }));
  }
}
