import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

// Hash passwords safely using Node.js native crypto module (no binary package gyp issues)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    // Create user in SQLite database with 1000 starting credits
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        credits: 1000,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      credits: newUser.credits,
    });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
