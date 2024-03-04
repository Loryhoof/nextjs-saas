import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server';

import prisma from '../../libs/prismadb'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export const maxDuration = 100;

const s3Client = new S3Client({
  region: '',
  credentials: {
    accessKeyId: '',
    secretAccessKey: ''
  }
})

export async function POST(request) {

const formData = await request.formData();
const files = formData.getAll('file');
const selectedStyles = JSON.parse(formData.get('styles'));

console.log(selectedStyles, "STYLES")
  
const session = await getServerSession(authOptions)

  if (!session) {
      return new NextResponse("Forbidden", {
          status: 403,
      });
  }

  try {
    const s3URLs = await Promise.all(files.map(async (file) => {
        return await uploadToS3AndGetURL(Buffer.from(await file.arrayBuffer()), file.name, file.type);
    }));

    if(s3URLs != null)
    {
        console.log("the URLS", s3URLs, "THE URLSSS");

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
                  set: s3URLs,
                },
                styles: {
                    set: selectedStyles
                },
                status: 'uploaded'
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

async function uploadToS3AndGetURL(buffer, name, type) {

  const fileExtension = name.split('.').pop(); // Extracting file extension
  const key = `${Date.now()}.${fileExtension}`;
  
  const params = {
    Bucket: '',
    Key: key,
    Body: buffer,
    ContentType: type,
  };

  const bucketURL = '';

  const command = new PutObjectCommand(params);

  await s3Client.send(command);

  let url = `${bucketURL}${key}`;
  return url;
}