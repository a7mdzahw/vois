import './global.css';
import { HeroUIProvider } from '@heroui/react';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'VOIS Office Reservations',
  description: 'Reserve meeting rooms and spaces at VOIS Office',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </HeroUIProvider>
      </body>
    </html>
  );
}
