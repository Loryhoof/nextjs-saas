import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Forbidden', {
      status: 403,
    });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  // We dont allow creating a new order when there is an active order
  if(user.orderStep !== "upload")
  {
    await prisma.user.update({
        where: { email: session.user.email },
        data: {
          orderStep: "checkout",
          ordering: true
        },
    });
  }


  return new NextResponse(JSON.stringify({ status: 200 }));
}
