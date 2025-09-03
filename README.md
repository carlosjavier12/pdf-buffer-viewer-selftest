# pdf-buffer-viewer-selftest

Este proyecto permite visualizar archivos PDF utilizando un buffer. A continuación se presentan algunos scripts básicos de npm para su uso:

## Scripts básicos de npm

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
}
```

## Ejemplo de uso

![Ejemplo de funcionamiento]
<img width="1118" height="990" alt="image" src="https://github.com/user-attachments/assets/47950eaa-dc5a-4e74-a129-89ce028db760" />


## Instalación

Para instalar las dependencias, ejecute:

```bash
npm i
npm run api
npm run dev
```

1 Buffer embebido (tu caso actual)

```tsx
import { embeddedPdfBase64, base64ToUint8Array } from './embeddedPdf'
const buffer = base64ToUint8Array(embeddedPdfBase64)
<PdfViewer source={buffer} />
```


2 Desde un archivo local (input file)

```tsx
import { useState } from 'react'
import PdfViewer from './PdfViewer'
function App() {
  const [buffer, setBuffer] = useState<Uint8Array>()
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    file.arrayBuffer().then((ab) => {
      setBuffer(new Uint8Array(ab))
    })
  }
  return (
    <>
      <input type="file" accept="application/pdf" onChange={handleFile} />
      {buffer && <PdfViewer source={buffer} />}
    </>
  )
}
```


3 Desde un backend con fetch

```tsx
import { useEffect, useState } from 'react'
import PdfViewer from './PdfViewer'
function App() {
  const [buffer, setBuffer] = useState<Uint8Array>()
  useEffect(() => {
    fetch('/api/reporte.pdf')
      .then((res) => res.arrayBuffer())
      .then((ab) => setBuffer(new Uint8Array(ab)))
  }, [])
  return buffer ? <PdfViewer source={buffer} /> : <p>Cargando…</p>
}
```
