import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Ludex - Board Game Companion',
  description: 'AI-powered board game rulebook companion - Turn PDFs into Play',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
