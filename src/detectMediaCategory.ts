import { fileTypeFromBlob } from 'file-type';
import { MediaCategory, DetectOptions } from './types';
import { MediaDetectionError } from './errors';

/**
 * Fetches a Blob from a URL.
 * @param url - The URL of the resource to fetch.
 * @returns A Promise that resolves to a Blob.
 * @throws Error if the fetch fails or the response is invalid.
 */
export async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType) {
    throw new Error('Missing Content-Type header');
  }

  return await response.blob();
}

/**
 * Detects the category of a file Blob (e.g., image, video, document, etc.)
 */
export const detectMediaCategory = async (
  blob: Blob,
  options?: DetectOptions
): Promise<MediaCategory> => {
  const { throwOnError = false, logger = console.error } = options ?? {};

  try {
    const fileType = await fileTypeFromBlob(blob);

    if (!fileType?.mime) return 'unknown';

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

    if (throwOnError) throw mediaError;

    logger(mediaError);
    return 'unknown';
  }
};

/**
 * Downloads a file from a URL and detects its media category.
 * @param url - The file URL.
 * @param options - Optional detection settings.
 * @returns The detected media category.
 */
export const getBlobAndDetectCategory = async (
  url: string,
  options?: DetectOptions,
  detectFn: typeof detectMediaCategory = detectMediaCategory
): Promise<MediaCategory | undefined> => {
  try {
    const blob = await urlToBlob(url);
    console.log('Blob:', blob);
    return await detectFn(blob, options);
  } catch (error) {
    console.error('Error in getBlobAndDetectCategory:', error);
    return undefined;
  }
};
