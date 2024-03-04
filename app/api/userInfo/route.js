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

  console.log(user.ordering, "IS ORDERING?") // a boolean

  return new NextResponse(JSON.stringify({ user: user }));
}
