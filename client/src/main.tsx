import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show update notification
                showUpdateNotification();
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

function showUpdateNotification() {
  const banner = document.createElement('div');
  banner.className = 'sw-update-banner show';
  banner.innerHTML = `
    <div class="flex items-center justify-center space-x-4">
      <span>New version available!</span>
      <button onclick="window.location.reload()" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
        Update
      </button>
    </div>
  `;
  document.body.appendChild(banner);
  
  setTimeout(() => {
    banner.classList.add('show');
  }, 100);
}

createRoot(document.getElementById("root")!).render(<App />);
