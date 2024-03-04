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

  console.log(user.orderStep, user.ordering) // a boolean

  if(user.ordering)
  {
    if(user.orderStep == "checkout")
    {
        proceedToStep("upload");
    }
    else if(user.orderStep == "upload")
    {
        finishOrder();
    }
  }
  else
  {
    startOrder();
  }

  const proceedToStep = async (nextStep) => {
    await prisma.user.update({
        where: { email: session.user.email },
        data: {
          orderStep: nextStep,
          ordering: true
        },
    });
  }

  // Only for starting orders after having completed the first one
  const startOrder = async () => {
    await prisma.user.update({
        where: { email: session.user.email },
        data: {
          orderStep: "checkout",
          ordering: true
        },
    });
  }

  const finishOrder = async () => {
    await prisma.user.update({
        where: { email: session.user.email },
        data: {
          orderStep: "completed",
          ordering: false
        },
    });
  }

  return new NextResponse(JSON.stringify({ status: 200 }));
}
