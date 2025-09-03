import PdfViewer from './PdfViewer'
import { embeddedPdfBase64, base64ToUint8Array } from './embeddedPdf'

function App() {
  // Caso actual: sigues trabajando con un buffer (Uint8Array)
  const buffer = base64ToUint8Array(embeddedPdfBase64)

  return (
    <PdfViewer source={buffer} />
  )
}

export default App