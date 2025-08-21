import PdfViewer from './PdfViewer'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h1>PDF Buffer Viewer - Self Test</h1>
      <p>Renderiza un PDF desde un <b>buffer</b> (sin URL pública).</p>
      <PdfViewer />
    </div>
  )
}
