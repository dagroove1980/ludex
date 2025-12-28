import './globals.css';
import { SessionProvider } from './providers';

export const metadata = {
  title: 'Ludex - Board Game Companion',
  description: 'AI-powered board game rulebook companion - Turn PDFs into Play',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
