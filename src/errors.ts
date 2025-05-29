export class MediaDetectionError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'MediaDetectionError';
    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}
