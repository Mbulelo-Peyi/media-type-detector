export type MediaCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'word'
  | 'excel'
  | 'csv'
  | 'text'
  | 'other'
  | 'unknown';

export interface DetectOptions {
  /** 
   * If true, throws errors instead of returning 'unknown'.
   * Default: false
   */
  throwOnError?: boolean;

  /** 
   * Optional custom logger function (defaults to console.error)
   */
  logger?: (error: unknown) => void;
}
