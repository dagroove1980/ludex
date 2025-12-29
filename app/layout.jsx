import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Ludex - Board Game Companion',
  description: 'AI-powered board game rulebook companion - Turn PDFs into Play',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
