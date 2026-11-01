import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoBanner from '@/components/DemoBanner';

export const metadata = {
  title: 'PLACEMENTPILOT AI — Practice. Analyze. Improve. Get Placement Ready.',
  description: 'AI-powered placement preparation platform for college students featuring timed aptitude, Monaco coding studio, department MCQs, and AI video interview analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        <DemoBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
