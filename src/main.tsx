import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './AppRouter.tsx'
import './index.css'

// Ignore uncaught errors originating solely from injected browser extensions
// (e.g., conflicting Web3 wallet extensions overwriting window.ethereum).
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event) => {
      const filename = event.filename || ''
      const stack = event.error instanceof Error ? event.error.stack || '' : ''
      const isExtensionSource =
        filename.startsWith('chrome-extension://') ||
        filename.startsWith('moz-extension://') ||
        filename.startsWith('safari-extension://') ||
        (event.message.includes('Cannot set property ethereum') &&
          stack.includes('chrome-extension://'))

      if (isExtensionSource) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    },
    true
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
