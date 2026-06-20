import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { StoreProvider } from '@/providers/store-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthBootstrap } from '@/providers/auth-bootstrap';
import { SocketProvider } from '@/modules/realtime';
import { RealtimeNotificationsListener } from '@/modules/realtime/components/realtime-notifications-listener';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Road Guard',
  description: 'AI-powered roadside assistance',
  icons: {
    icon: '/images/roadguardlogo.png',
    apple: '/images/roadguardlogo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <StoreProvider>
            <AuthBootstrap>
              <SocketProvider>
                <RealtimeNotificationsListener />
                {children}
              </SocketProvider>
            </AuthBootstrap>
            <Toaster richColors position="top-right" closeButton />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
