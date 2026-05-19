import './globals.css';

export const metadata = {
  title: 'Forge — Workout',
  description: 'Mobile workout timer with rep logging and history.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#09090b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
