import { fileTypeFromBlob } from 'file-type';
import { MediaCategory, DetectOptions } from './types';
import { MediaDetectionError } from './errors';

/**
 * Detects the category of a file Blob (e.g., image, video, document, text, etc.)
 * @param blob - The file Blob to analyze
 * @param options - Optional configuration for error handling
 * @returns A promise that resolves to the detected media category
 * @throws MediaDetectionError if throwOnError is true and detection fails
 */
export const detectMediaCategory = async (
  blob: Blob,
  options?: DetectOptions
): Promise<MediaCategory> => {
  const { throwOnError = false, logger = console.error } = options ?? {};

  try {
    const fileType = await fileTypeFromBlob(blob);

    if (!fileType?.mime) {
      return 'unknown';
    }

    const { mime, ext } = fileType;

    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime === 'application/pdf') return 'pdf';

    if (
      mime === 'application/msword' ||
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) return 'word';

    if (
      mime === 'application/vnd.ms-excel' ||
      mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) return 'excel';

    if (mime === 'text/csv' || ext === 'csv') return 'csv';

    if (
      mime === 'text/plain' ||
      ext === 'txt' ||
      ext === 'log' ||
      ext === 'md'
    ) return 'text';

    return 'other';
  } catch (error) {
    const mediaError = new MediaDetectionError(
      'Failed to detect media category',
      error
    );

    if (throwOnError) {
      throw mediaError;
    }

    logger(mediaError);
    return 'unknown';
  }
};
