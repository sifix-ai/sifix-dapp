// DELETE /api/v1/address/[address]/tags/[tagId] - Remove a tag from an address

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';
import { verifyApiAuth } from '@/lib/extension-auth';

export async function DELETE(
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

    // Find the tag
    const tag = await prisma.addressTag.findUnique({
      where: { id: tagId },
      include: { addresses: true },
    });

    if (!tag) {
      return errors.notFound('Tag');
    }

    // Verify the tag belongs to the specified address
    if (tag.address.address.toLowerCase() !== address.toLowerCase()) {
      return errors.notFound('Tag');
    }

    // Only the tag creator or the address owner can delete
    // For now, only the tagger can delete their own tag
    if (tag.taggedBy && auth.walletAddress && tag.taggedBy.toLowerCase() !== auth.walletAddress.toLowerCase()) {
      return errors.forbidden('Only the tag creator can delete this tag');
    }

    // Delete the tag
    await prisma.addressTag.delete({
      where: { id: tagId },
    });

    return apiSuccess({
      deleted: true,
      tagId,
    });
  } catch (error) {
    console.error('Error deleting address tag:', error);
    return apiError('Internal server error', '500');
  }
}
