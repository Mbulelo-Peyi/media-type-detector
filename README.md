# Media Type Detector

A tiny utility to detect and classify the category of a file (image, video, audio, document, etc.) from a `Blob` using [file-type](https://github.com/sindresorhus/file-type).

🧪 Written in TypeScript  
🌐 Works in the browser  
⚛️ Ready for use in React apps  
🤝 Created by volunteers at GoodWorkHub

## Installation

```bash
npm install media-type-detector

yarn add media-type-detector
```

## Usage
```jsx
import { detectMediaCategory } from 'media-type-detector';

const category = await detectMediaCategory(file); // file is a Blob or File
console.log(category); // 'image', 'video', 'pdf', etc.
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
