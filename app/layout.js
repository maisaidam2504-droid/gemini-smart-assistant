import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata = {
  title: 'Gemini Smart Assistant',
  description: 'المساعد الذكي المتطور المدعوم بـ Gemini',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
