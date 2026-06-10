import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-family',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins-family',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | iShyne',
    default: 'iShyne — Brilla siempre',
  },
  description:
    'Tienda online de moda femenina de lujo en Lima, Perú. Vestidos, tops, faldas y accesorios para la mujer que brilla.',
  keywords: ['moda femenina', 'ropa de lujo', 'Lima', 'Perú', 'iShyne', 'vestidos', 'moda'],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://ishyne.pe',
    siteName: 'iShyne',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${poppins.variable} font-poppins antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
