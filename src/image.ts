/**
 * Image processing for NanoClaw
 * Downloads, resizes, and stores image attachments for agent vision.
 */
import fs from 'fs';
import path from 'path';

import sharp from 'sharp';

import { logger } from './logger.js';

export interface ImageAttachment {
  relativePath: string;
  mediaType: string;
}

export interface ProcessedImage {
  content: string;
  attachment: ImageAttachment;
}

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 85;

/**
 * Resize image buffer to max 1024px, save to groupDir/attachments/, return content ref and attachment.
 */
export async function processImage(
  buffer: Buffer,
  groupDir: string,
  caption?: string,
): Promise<ProcessedImage> {
  const attachmentsDir = path.join(groupDir, 'attachments');
  fs.mkdirSync(attachmentsDir, { recursive: true });

  const random = Math.random().toString(36).slice(2, 8);
  const filename = `img-${Date.now()}-${random}.jpg`;
  const filePath = path.join(attachmentsDir, filename);
  const relativePath = path.join('attachments', filename);

  await sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toFile(filePath);

  logger.debug({ filePath }, 'Image saved');

  const captionSuffix = caption ? ` ${caption}` : '';
  const content = `[Image: ${relativePath}]${captionSuffix}`;

  return {
    content,
    attachment: { relativePath, mediaType: 'image/jpeg' },
  };
}

/**
 * Scan message contents for [Image: attachments/...] references and return attachment descriptors.
 */
export function parseImageReferences(
  messages: Array<{ content: string }>,
): ImageAttachment[] {
  const pattern = /\[Image:\s*(attachments\/[^\]]+)\]/g;
  const attachments: ImageAttachment[] = [];
  const seen = new Set<string>();

  for (const msg of messages) {
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(msg.content)) !== null) {
      const relativePath = match[1].trim();
      if (!seen.has(relativePath)) {
        seen.add(relativePath);
        attachments.push({ relativePath, mediaType: 'image/jpeg' });
      }
    }
  }

  return attachments;
}
