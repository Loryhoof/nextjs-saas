import bcrypt from 'bcrypt'
import prisma from '../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const body = await request.json();
    const {email, password } = body;

    if (!email || !password) {
        return new NextResponse('Missing fields', { status: 400});

    }

    const exists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (exists) {
         throw new Error('Email already exists');    
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            hashedPassword
        }
    });

    console.log(user, "da useraaaa backend");

    return NextResponse.json(user);

}