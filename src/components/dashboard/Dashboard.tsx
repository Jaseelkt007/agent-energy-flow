import { usePolling } from "@/hooks/usePolling";
import { api } from "@/lib/energy-api";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "./Header";
import { ControlBar } from "./ControlBar";
import { MetricStrip } from "./MetricStrip";
import { AgentStepper } from "./AgentStepper";
import { EnergyFlow } from "./EnergyFlow";
import { PolicyPanel } from "./PolicyPanel";
import { PaymentLedger } from "./PaymentLedger";
import { EventFeed } from "./EventFeed";
import { HistoryChart } from "./HistoryChart";
import { Section } from "./primitives";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  const snapshot = usePolling(api.snapshot, 2000);
  const payments = usePolling(api.payments, 2000);
  const events = usePolling(api.events, 2000);
  const history = usePolling(api.history, 2000);
  const offline = Boolean(snapshot.error) && !snapshot.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar snapshot={snapshot.data} offline={offline} />
          </div>
        </div>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
            <Header snapshot={snapshot.data} offline={offline} />
            <ControlBar snapshot={snapshot.data} />

            <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <Section title="Energy Flow" className="lg:col-span-2">
                  <EnergyFlow s={snapshot.data} />
                  <div className="mt-5 border-t border-border pt-5">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Agent State
                    </div>
                    <AgentStepper s={snapshot.data} />
                  </div>
                </Section>
                <div className="flex flex-col gap-4 sm:gap-6">
                  <MetricStrip s={snapshot.data} />
                  <PolicyPanel snapshot={snapshot.data} />
                </div>
              </div>

              <Section title="Live Payment Ledger">
                <PaymentLedger payments={payments.data} />
              </Section>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <Section title="Event Feed">
                  <EventFeed events={events.data} />
                </Section>
                <Section title="Solar & Price · 10 min">
                  <HistoryChart data={history.data} />
                </Section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
