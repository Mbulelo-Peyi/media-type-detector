jest.mock('file-type');

import { fileTypeFromBlob } from 'file-type';
import { detectMediaCategory, } from '../index';
import { MediaDetectionError } from '../errors';

const mockedFileTypeFromBlob = fileTypeFromBlob as jest.MockedFunction<typeof fileTypeFromBlob>;

describe('detectMediaCategory', () => {
  const mockBlob = new Blob(['dummy data'], { type: 'application/octet-stream' });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { mime: 'image/png', expected: 'image' },
    { mime: 'video/mp4', expected: 'video' },
    { mime: 'audio/mpeg', expected: 'audio' },
    { mime: 'application/pdf', expected: 'pdf' },
    { mime: 'application/msword', expected: 'word' },
    { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', expected: 'word' },
    { mime: 'application/vnd.ms-excel', expected: 'excel' },
    { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', expected: 'excel' },
    { mime: 'text/csv', expected: 'csv' },
    { mime: 'text/plain', expected: 'text' },
    { mime: 'application/zip', ext: 'zip', expected: 'other' },
    { mime: 'application/octet-stream', expected: 'other' },
    { mime: '', expected: 'unknown' },
    { mime: 'text/plain', ext: 'log', expected: 'text' },
    { mime: 'text/plain', ext: 'md', expected: 'text' },
  ];

  testCases.forEach(({ mime, ext, expected }) => {
    it(`detects "${mime}"${ext ? ` with ext "${ext}"` : ''} as "${expected}"`, async () => {
      mockedFileTypeFromBlob.mockResolvedValueOnce({ mime, ext } as any);
      const result = await detectMediaCategory(mockBlob);
      expect(result).toBe(expected);
    });
  });

  it('returns "unknown" if fileTypeFromBlob returns null', async () => {
    mockedFileTypeFromBlob.mockResolvedValueOnce(null as any);
    const result = await detectMediaCategory(mockBlob);
    expect(result).toBe('unknown');
  });

  it('returns "unknown" on error and logs it', async () => {
    const error = new Error('something went wrong');
    mockedFileTypeFromBlob.mockRejectedValueOnce(error);

    const logger = jest.fn();
    const result = await detectMediaCategory(mockBlob, { logger });
    expect(result).toBe('unknown');
    expect(logger).toHaveBeenCalledWith(expect.any(MediaDetectionError));
  });

  it('uses default logger if none provided', async () => {
    const error = new Error('fail');
    mockedFileTypeFromBlob.mockRejectedValueOnce(error);

    const originalConsoleError = console.error;
    console.error = jest.fn();

    const result = await detectMediaCategory(mockBlob);
    expect(result).toBe('unknown');
    expect(console.error).toHaveBeenCalledWith(expect.any(MediaDetectionError));

    console.error = originalConsoleError;
  });

  it('throws MediaDetectionError if throwOnError is true', async () => {
    mockedFileTypeFromBlob.mockRejectedValueOnce(new Error('boom'));

    await expect(
      detectMediaCategory(mockBlob, { throwOnError: true })
    ).rejects.toThrow(MediaDetectionError);
  });

  it('wraps the original error inside MediaDetectionError', async () => {
    const originalError = new Error('unexpected failure');
    mockedFileTypeFromBlob.mockRejectedValueOnce(originalError);

    const logger = jest.fn();
    await detectMediaCategory(mockBlob, { logger });

    const loggedError = logger.mock.calls[0][0];
    expect(loggedError).toBeInstanceOf(MediaDetectionError);
    expect((loggedError as MediaDetectionError).originalError).toBe(originalError);
  });
});
