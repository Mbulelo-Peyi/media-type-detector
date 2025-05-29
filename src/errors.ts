export class MediaDetectionError extends Error {
  public originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'MediaDetectionError';
    this.originalError = originalError;

    // Append original error stack if available
    if (originalError instanceof Error) {
      this.stack += '\nCaused by: ' + originalError.stack;
    } else if (typeof originalError === 'string') {
      this.stack += '\nCaused by: ' + originalError;
    }

    // Maintains proper stack trace (for V8 environments like Node)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MediaDetectionError);
    }
  }
}
