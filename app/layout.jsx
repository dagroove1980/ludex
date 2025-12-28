export const metadata = {
  title: 'Ludex - Board Game Companion',
  description: 'AI-powered board game rulebook companion - Turn PDFs into Play',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

