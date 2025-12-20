import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DebugErrorBoundary from './components/DebugErrorBoundary'

// FORCE UNREGISTER ALL SERVICE WORKERS
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// Build timestamp: 2025-12-12T02:22:00 - Force cache invalidation
// Simple, reliable mount
const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <DebugErrorBoundary>
        <App />
      </DebugErrorBoundary>
    </StrictMode>
  )
}
