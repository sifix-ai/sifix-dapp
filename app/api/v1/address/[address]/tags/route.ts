// GET  /api/v1/address/[address]/tags - Get all tags for an address
// POST /api/v1/address/[address]/tags - Add a tag to an address

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';
import { verifyApiAuth } from '@/lib/extension-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || !isValidEthereumAddress(address)) {
      return errors.invalidAddress();
    }

    const normalizedAddress = address.toLowerCase();

    // Find the address record (auto-create if missing for read)
    let addressRecord = await prisma.address.findUnique({
      where: { address: normalizedAddress },
      include: {
        tags: {
          orderBy: { upvotes: 'desc' },
        },
      },
    });

    if (!addressRecord) {
      return apiSuccess({
        address: normalizedAddress,
        tags: [],
      });
    }

    return apiSuccess({
      address: addressRecord.address,
      tags: addressRecord.tags.map((t) => ({
        id: t.id,
        tag: t.tag,
        taggedBy: t.taggedBy,
        upvotes: t.upvotes,
        downvotes: t.downvotes,
        score: t.upvotes - t.downvotes,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching address tags:', error);
    return apiError('Internal server error', '500');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  // Auth check
  const auth = await verifyApiAuth();
  if (!auth.authorized) {
    return errors.unauthorized(auth.error || 'Unauthorized');
  }

  try {
    const { address } = await params;

    if (!address || !isValidEthereumAddress(address)) {
      return errors.invalidAddress();
    }

    const normalizedAddress = address.toLowerCase();

    const body = await request.json();
    const { tag } = body;

    // Validate tag
    if (!tag || typeof tag !== 'string' || tag.trim().length === 0) {
      return apiError('Tag is required', '400');
    }

    const normalizedTag = tag.trim().toLowerCase();

    // Limit tag length
    if (normalizedTag.length > 50) {
      return apiError('Tag must be 50 characters or fewer', '400');
    }

    // Validate tag format (alphanumeric, hyphens, underscores only)
    if (!/^[a-z0-9_-]+$/.test(normalizedTag)) {
      return apiError('Tag must contain only lowercase letters, numbers, hyphens, and underscores', '400');
    }

    // Get or create the address record
    let addressRecord = await prisma.address.findUnique({
      where: { address: normalizedAddress },
    });

    if (!addressRecord) {
      addressRecord = await prisma.address.create({
        data: { address: normalizedAddress },
      });
    }

    // Check if tag already exists for this address
    const existingTag = await prisma.addressTag.findUnique({
      where: {
        addressId_tag: {
          addressId: addressRecord.id,
          tag: normalizedTag,
        },
      },
    });

    if (existingTag) {
      return apiError('Tag already exists for this address', '409');
    }

    // Create the tag
    const addressTag = await prisma.addressTag.create({
      data: {
        addressId: addressRecord.id,
        tag: normalizedTag,
        taggedBy: auth.walletAddress ?? null,
        upvotes: 1, // Auto-upvote by tagger
        downvotes: 0,
      },
    });

    return apiSuccess({
      id: addressTag.id,
      tag: addressTag.tag,
      taggedBy: addressTag.taggedBy,
      upvotes: addressTag.upvotes,
      downvotes: addressTag.downvotes,
      createdAt: addressTag.createdAt,
    });
  } catch (error) {
    console.error('Error creating address tag:', error);
    return apiError('Internal server error', '500');
  }
}
