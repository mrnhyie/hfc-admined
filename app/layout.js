import '@fontsource-variable/manrope';
// The full Fraunces file, not the wght-only one: SOFT and WONK are what give the
// display face its character.
import '@fontsource-variable/fraunces/full.css';
import './globals.css';

export async function generateMetadata() {
  const title = process.env.SITE_NAME || 'Higherlife Family Chapel International';
  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: 'A place to worship, grow, connect and serve.',
  };
}

export const dynamic = 'force-dynamic';

export const viewport = { themeColor: '#300b38' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
