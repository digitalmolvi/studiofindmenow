import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, List } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-7 w-7"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12a3 3 0 1 0 3 3"/></svg>
          <h1 className="text-xl font-semibold text-foreground font-headline">FindMeNow</h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">
              <List className="mr-2 h-4 w-4" />
              Reported Cases
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/report-case">
              <PlusCircle className="mr-2 h-4 w-4" />
              Report New Case
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
