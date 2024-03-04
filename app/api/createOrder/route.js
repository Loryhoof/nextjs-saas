import axios from 'axios';

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import prisma from '../../libs/prismadb'

export const maxDuration = 100;

export async function POST(request) {

const body = await request.json();
const orderData = body;
  
const session = await getServerSession(authOptions)

  if (!session) {
      return new NextResponse("Forbidden", {
          status: 403,
      });
  }

  try {

    if(orderData.urls != null)
    {
        console.log("the URLS", orderData.urls, "THE URLSSS");
        console.log(orderData.imageType, "IMAGE TPYEEEEEEEEEE")

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
          });
        
        const order = await prisma.order.findUnique({
            where: {
              id: user.activeOrderId,
            },
          });
          
          const updatedOrder = await prisma.order.update({
            where: { id: user.activeOrderId },
            data: {
                images: {
                  set: orderData.urls,
                },
                styles: {
                    set: orderData.styles
                },
                imageType: orderData.imageType,
                status: 'uploaded'
              },
          });

          await prisma.user.update({
            where: { email: session.user.email },
            data: {
              orderStep: "completed",
              ordering: false,
              firstOrder: false
            },
        });

        return new Response(JSON.stringify({ order: order }));
    }
    
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}