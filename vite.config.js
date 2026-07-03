import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'force-close-process',
      closeBundle() {
        // This forces the Node process to shut down and tells Vercel the build is officially done
        setTimeout(() => {
          console.log('Build completed. Force closing worker threads...');
          process.exit(0);
        }, 100);
      }
    }
  ],
  build: {
    // Optional: Silences the plugin timings report if it's hanging the process listener
    reportCompressedSize: false 
  }
})