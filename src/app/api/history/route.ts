import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID parameter is required.' },
        { status: 400 }
      );
    }

    // Retrieve histories ordered by creation date descending
    const histories = await prisma.documentHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Reconstruct fields for output
    const formattedHistories = histories.map(h => ({
      id: h.id,
      filename: h.filename,
      timestamp: h.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      tone: h.tone,
      originalAiScore: h.originalAiScore,
      humanizedHumanScore: h.humanizedHumanScore,
      blocks: JSON.parse(h.blocksJson),
    }));

    return NextResponse.json(formattedHistories);
  } catch (error) {
    console.error('History GET API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, filename, tone, originalAiScore, humanizedHumanScore, blocks } = await request.json() as {
      userId: string;
      filename: string;
      tone: string;
      originalAiScore: number;
      humanizedHumanScore: number;
      blocks: Array<{ content: string }>;
    };

    if (!userId || !filename || !blocks) {
      return NextResponse.json(
        { error: 'User ID, filename, and blocks are required.' },
        { status: 400 }
      );
    }

    // Calculate word count
    const wordCount = blocks.reduce((acc: number, block) => {
      const words = block.content.split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);

    // Verify credits in user account
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    if (user.credits < wordCount) {
      return NextResponse.json(
        { error: 'Insufficient credits for this request.' },
        { status: 400 }
      );
    }

    // Run transaction: Create history log and deduct credits
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: wordCount,
          },
        },
      });

      const newHistory = await tx.documentHistory.create({
        data: {
          filename,
          tone,
          originalAiScore,
          humanizedHumanScore,
          blocksJson: JSON.stringify(blocks),
          userId,
        },
      });

      return { updatedUser, newHistory };
    });

    return NextResponse.json({
      success: true,
      credits: result.updatedUser.credits,
      record: {
        id: result.newHistory.id,
        filename: result.newHistory.filename,
        timestamp: result.newHistory.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        tone: result.newHistory.tone,
        originalAiScore: result.newHistory.originalAiScore,
        humanizedHumanScore: result.newHistory.humanizedHumanScore,
        blocks: JSON.parse(result.newHistory.blocksJson),
      },
    });
  } catch (error) {
    console.error('History POST API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
