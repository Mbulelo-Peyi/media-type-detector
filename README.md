# Media Type Detector

A tiny utility to detect and classify the category of a file (image, video, audio, document, etc.) from a `Blob` using [file-type](https://github.com/sindresorhus/file-type).

Written in TypeScript  
Works in the browser  
Ready for use in React apps  

## Installation

```bash
npm install media-type-detector

yarn add media-type-detector
```

## Usage
```jsx
import { detectMediaCategory, urlToBlob, getBlobAndDetectCategory } from 'media-type-detector';

// Example 1: Detect category from a Blob or File directly
const file = new Blob(['...'], { type: 'image/png' });
const category1 = await detectMediaCategory(file);
console.log('Category from Blob:', category1); // e.g. 'image'

// Example 2: Convert a URL to a Blob
const url = 'https://example.com/image.png';
try {
  const blob = await urlToBlob(url);
  console.log('Blob fetched from URL:', blob);
} catch (error) {
  console.error('Failed to fetch blob:', error);
}

// Example 3: Fetch a file from a URL and detect its media category in one step
const category3 = await getBlobAndDetectCategory(url);
console.log('Category from URL:', category3); // e.g. 'image'

```


## Options

```jsx
detectMediaCategory(blob, {
  throwOnError?: boolean;
  logger?: (error: Error) => void;
});
```

## Categories

The function returns one of the following media categories:

| Category  | Description            |
|-----------|------------------------|
| `image`   | Image file types       |
| `video`   | Video file types       |
| `audio`   | Audio file types       |
| `pdf`     | PDF documents          |
| `word`    | Microsoft Word files   |
| `excel`   | Microsoft Excel files  |
| `csv`     | CSV files              |
| `text`    | Plain text files       |
| `other`   | Other or uncategorized |
| `unknown` | Unable to determine    |
