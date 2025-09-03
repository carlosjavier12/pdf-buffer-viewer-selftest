import { useMemo, useState, useCallback, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import './pdfWorker'

const pdfOptions = { standardFontDataUrl: '' }

export interface PdfViewerProps {
  /** Fuente binaria del PDF. Acepta Uint8Array (tu caso actual) o ArrayBuffer (fetch, File, etc.) */
  source: Uint8Array | ArrayBuffer
}

export default function PdfViewer({ source }: PdfViewerProps) {
  const [scale, setScale] = useState(1.0)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  // Normalizamos siempre a Uint8Array para pasar a react-pdf.
  const file = useMemo(() => {
    const buffer = source instanceof Uint8Array ? source : new Uint8Array(source)
    return { data: buffer }
  }, [source])

  const onDocLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }, [])

  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.1).toFixed(2)))
  const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))
  const resetZoom = () => setScale(1)
  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1))
  const goNext = () => setPageNumber((p) => Math.min(numPages || 1, p + 1))

  // Atajos de teclado útiles
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === '0') resetZoom()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [numPages])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', background: '#e0e0e0', minHeight: '100vh' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          background: '#fff',
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          margin: 12
        }}
      >
        <button aria-label="Disminuir zoom" onClick={zoomOut}>−</button>
        <button aria-label="Restablecer zoom" onClick={resetZoom}>100%</button>
        <button aria-label="Aumentar zoom" onClick={zoomIn}>+</button>
        <span style={{ marginLeft: 8 }}>{Math.round(scale * 100)}%</span>
        <span style={{ margin: '0 12px' }}>|</span>
        <button aria-label="Página anterior" onClick={goPrev} disabled={pageNumber <= 1}>←</button>
        <span>Pág. {pageNumber} / {numPages || '—'}</span>
        <button aria-label="Página siguiente" onClick={goNext} disabled={!numPages || pageNumber >= numPages}>→</button>
      </div>

      {/* Lienzo del documento */}
      <div
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          background: '#fff',
          margin: 12,
          borderRadius: 8,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 80px)'
        }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocLoad}
          options={pdfOptions}
          loading={<div style={{ padding: 16 }}>Preparando documento…</div>}
          error={<div style={{ padding: 16, color: '#b00020' }}>Error al cargar el documento.</div>}
          noData={<div style={{ padding: 16 }}>Sin datos de PDF.</div>}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
    </div>
  )
}