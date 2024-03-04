import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import AWS from 'aws-sdk'

export const maxDuration = 100;

const region = '';
const bucketName = '';
const accessKeyId = '';
const secretAccessKey = '';

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})


export async function POST(request) {

const body = await request.json();
const { urls } = body;

const session = await getServerSession(authOptions)

  if (!session) {
      return new NextResponse("Forbidden", {
          status: 403,
      });
  }

  try {
    const signedURLS = await Promise.all(urls.map(async (url) => {
        return await getSigned(url);
    }));

    return new NextResponse(JSON.stringify({ signedURLS: signedURLS }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}

async function getSigned(url)
{

    const namePrefix = uuidv4();

    const fileExtension = url.split('.').pop();
    const imageName = `${namePrefix}.${fileExtension}`;

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}