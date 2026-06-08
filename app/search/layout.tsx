import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search for Patchwell premium transdermal wellness patches.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
