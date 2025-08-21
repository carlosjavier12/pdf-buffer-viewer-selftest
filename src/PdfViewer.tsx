import { useEffect, useMemo, useState } from 'react'
import { Document, Page } from 'react-pdf'
import './pdfWorker'
import { embeddedPdfBase64, base64ToUint8Array } from './embeddedPdf'

// Define options outside the component to prevent re-creation on each render.
const pdfOptions = { standardFontDataUrl: '' }

export default function PdfViewer() {
  const [data, setData] = useState<Uint8Array>()
  const [scale, setScale] = useState(1.0)

  useEffect(() => {
    // ✅ Self-test: carga desde base64 embebido (simula buffer privado)
    setData(base64ToUint8Array(embeddedPdfBase64))
  }, [])

  // Memoize the file object to prevent re-creation on re-renders.
  // This is the key to solving the DataCloneError.
  const file = useMemo(() => (data ? { data } : null), [data])

  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.1)
  }

  const zoomOut = () => {
    // Prevenir que la escala sea demasiado pequeña
    setScale((prevScale) => Math.max(0.5, prevScale - 0.1))
  }

  return (
    <div
      style={{
        backgroundColor: '#e0e0e0',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        height: '100vh',
        width: '100%',
        // overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <button onClick={zoomOut}>Disminuir</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn}>Aumentar</button>
      </div>
      {!file && <div>Cargando…</div>}
      {file && (
        <div style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)', height: '100%' }}>
          <Document
            file={file}
            onLoadError={(e) => console.error('PDF load error:', e)}
            options={pdfOptions}
          >
            <Page pageNumber={1} scale={scale} />
          </Document>
        </div>
      )}
    </div>
  )
}
