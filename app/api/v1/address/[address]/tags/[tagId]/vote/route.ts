// POST /api/v1/address/[address]/tags/[tagId]/vote - Upvote or downvote a tag

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';
import { verifyApiAuth } from '@/lib/extension-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string; tagId: string }> }
) {
  // Auth check
  const auth = await verifyApiAuth();
  if (!auth.authorized) {
    return errors.unauthorized(auth.error || 'Unauthorized');
  }

  try {
    const { address, tagId } = await params;

    if (!address || !isValidEthereumAddress(address)) {
      return errors.invalidAddress();
    }

    if (!tagId) {
      return apiError('Tag ID is required', '400');
    }

    const body = await request.json();
    const { direction } = body;

    if (!direction || !['up', 'down'].includes(direction)) {
      return apiError('Vote direction must be "up" or "down"', '400');
    }

    // Find the tag
    const tag = await prisma.addressTag.findUnique({
      where: { id: tagId },
      include: { address: true },
    });

    if (!tag) {
      return errors.notFound('Tag');
    }

    // Verify the tag belongs to the specified address
    if (tag.address.address.toLowerCase() !== address.toLowerCase()) {
      return errors.notFound('Tag');
    }

    // Update the vote count
    const updatedTag = await prisma.addressTag.update({
      where: { id: tagId },
      data: {
        upvotes: direction === 'up' ? { increment: 1 } : undefined,
        downvotes: direction === 'down' ? { increment: 1 } : undefined,
      },
    });

    return apiSuccess({
      id: updatedTag.id,
      tag: updatedTag.tag,
      upvotes: updatedTag.upvotes,
      downvotes: updatedTag.downvotes,
      score: updatedTag.upvotes - updatedTag.downvotes,
    });
  } catch (error) {
    console.error('Error voting on address tag:', error);
    return apiError('Internal server error', '500');
  }
}
