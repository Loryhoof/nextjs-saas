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

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if(!user.activeOrderId || user.activeOrderId == null)
  {
    return new NextResponse(JSON.stringify({ order: null }));
  }

  const order = await prisma.order.findUnique({
    where: {
    id: user.activeOrderId,
    },
});

  if (user && user.activeOrderId) {
    return new NextResponse(JSON.stringify({ order: order }));
  } else {
    return new NextResponse(JSON.stringify({ order: null }));
  }
}
