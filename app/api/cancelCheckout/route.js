import axios from 'axios';

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import prisma from '../../libs/prismadb'

export const maxDuration = 100;

export async function POST() {

// const body = await request.json();
// const orderData = body;
  
const session = await getServerSession(authOptions)

  if (!session) {
      return new NextResponse("Forbidden", {
          status: 403,
      });
  }

  try {

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
          orderStep: "cancelled",
          ordering: false
        },
    });

    return new Response(JSON.stringify({ status: 200 }));
    
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}