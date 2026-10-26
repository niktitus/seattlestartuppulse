import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { TAG_GROUPS, AVAILABILITY } from '@/lib/coffee';

/** Printable half-page paper fallback card for the Coffee Commitment. */
export default function CoffeePaperPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-6 px-4 print:py-0">
      <Button onClick={() => window.print()} className="mb-4 print:hidden gap-2">
        <Printer className="h-4 w-4" /> Print cards
      </Button>
      {[0, 1].map((i) => (
        <div key={i} className="border-2 border-black rounded-lg p-5 mb-6 print:mb-0 print:break-after-page" style={{ width: '8.5in', height: '5.5in' }}>
          <div className="flex justify-between items-start h-full">
            <div className="flex-1 pr-6 space-y-3 text-sm">
              <div>
                <h1 className="text-xl font-bold">Coffee Commitment ☕</h1>
                <p className="text-xs">Nov 6 pop-up · AI House · Leave with a coffee on the calendar</p>
              </div>
              <div className="space-y-2">
                <p>First name: ____________________ Email: ____________________</p>
                <p>Stage (circle): Student · Early career · Mid-career · Career switcher · Returning to work · Founder · Leader</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold">Choose one:</p>
                <p>☐ I'm having coffee with someone I met — their name: ____________________</p>
                <p>☐ Match me with someone into: ____________________</p>
                <p>☐ (Mentors) I'll take ____ coffee(s) with a mentee into: ____________________</p>
              </div>
              <div>
                <p className="font-bold text-xs mb-1">Tags: {TAG_GROUPS.flatMap((g) => g.tags).join(' · ')}</p>
                <p className="text-xs">When works (circle): {AVAILABILITY.join(' · ')} · Neighborhood: ____________</p>
              </div>
              <p className="text-xs">Drop this card at the "Before you go" station. We'll email you by Saturday with your coffee details and a voucher.</p>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <QRCode value="https://seattlestartuppulse.com/coffee" size={110} />
              <p className="text-xs text-center w-28">Rather type it? Scan me.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
