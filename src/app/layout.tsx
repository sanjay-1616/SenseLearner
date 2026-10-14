import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/lib/hooks/use-accessibility';

export const metadata: Metadata = {
  title: 'SenseLearn — Interactive Multisensory Learning & Engagement Profiling',
  description: 'An interactive multisensory learning platform that understands learner needs, adapts learning experiences, and transforms observable interaction data into meaningful educational insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
