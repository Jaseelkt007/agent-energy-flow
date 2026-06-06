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

export function Dashboard() {
  const snapshot = usePolling(api.snapshot, 2000);
  const payments = usePolling(api.payments, 2000);
  const events = usePolling(api.events, 2000);
  const history = usePolling(api.history, 2000);
  const offline = Boolean(snapshot.error) && !snapshot.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-8 sm:px-6">
        <Header snapshot={snapshot.data} offline={offline} />
        <ControlBar snapshot={snapshot.data} />

        <div className="mt-6 space-y-6">
          <MetricStrip s={snapshot.data} />

          <div className="grid gap-6 lg:grid-cols-3">
            <Section title="Agent State" className="lg:col-span-2">
              <AgentStepper s={snapshot.data} />
              <div className="mt-6">
                <EnergyFlow s={snapshot.data} />
              </div>
            </Section>
            <PolicyPanel snapshot={snapshot.data} />
          </div>

          <Section title="Live Payment Ledger">
            <PaymentLedger payments={payments.data} />
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Event Feed">
              <EventFeed events={events.data} />
            </Section>
            <Section title="Solar & Price · 10 min">
              <HistoryChart data={history.data} />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
