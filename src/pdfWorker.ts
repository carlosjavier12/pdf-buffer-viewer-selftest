
import { pdfjs } from 'react-pdf';

// Worker clásico de PDF.js v3 (NO ESM)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();
