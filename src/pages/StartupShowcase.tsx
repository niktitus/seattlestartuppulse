import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';

export default function StartupShowcase() {
  return (
    <>
      <Seo
        title="Startup Showcase"
        description="A curated showcase of standout Seattle startups building the future."
        path="/showcase"
      />
      <AppLayout activeTab={"showcase" as any}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Startup Showcase</h1>
            <p className="text-sm text-muted-foreground">
              A curated spotlight on Seattle startups worth watching. Featured companies, breakout
              products, and the founders behind them.
            </p>
          </header>

          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showcase entries coming soon. Check back for featured Seattle startups.
            </p>
          </div>
        </div>
      </AppLayout>
    </>
  );
}