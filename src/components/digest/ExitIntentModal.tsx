import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DigestSignup, { SourceTab } from './DigestSignup';

const EXIT_INTENT_COOKIE = 'digest_exit_intent_shown';
const COOKIE_EXPIRY_DAYS = 30;

interface ExitIntentModalProps {
  sourceTab?: SourceTab;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function ExitIntentModal({ sourceTab = 'events' }: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves through the top of the viewport
    if (e.clientY <= 0 && !hasTriggered) {
      // Check if already shown via cookie
      if (getCookie(EXIT_INTENT_COOKIE)) {
        return;
      }

      setIsOpen(true);
      setHasTriggered(true);
      setCookie(EXIT_INTENT_COOKIE, 'true', COOKIE_EXPIRY_DAYS);
    }
  }, [hasTriggered]);

  useEffect(() => {
    // Only add listener on desktop (checking for mouse capability)
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    if (!isDesktop) return;

    // Check if already shown
    if (getCookie(EXIT_INTENT_COOKIE)) {
      setHasTriggered(true);
      return;
    }

    // Add a slight delay before enabling the exit intent
    const timeoutId = setTimeout(() => {
      document.addEventListener('mouseout', handleExitIntent);
    }, 5000); // 5 second delay before activating

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseout', handleExitIntent);
    };
  }, [handleExitIntent]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 border-border">
        <DialogTitle className="sr-only">Subscribe to the Seattle Founders Digest</DialogTitle>
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="bg-primary/5 border-b border-primary/20 p-6 text-center">
            <p className="text-2xl mb-2">👋</p>
            <h2 className="text-lg font-semibold text-foreground">
              Before you go...
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Want the best of Seattle startups in your inbox?
            </p>
          </div>

          {/* Signup Form */}
          <div className="p-6">
            <DigestSignup 
              sourceTab={sourceTab} 
              sourceType="exit_intent"
              compact
              onSuccess={handleSuccess}
            />
          </div>

          {/* Maybe Later */}
          <div className="border-t border-border p-4 text-center">
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
