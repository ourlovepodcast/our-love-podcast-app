// app/layout.tsx
import './globals.css';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* TrustBox script loaded via Next.js Script component */}
        <Script 
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
