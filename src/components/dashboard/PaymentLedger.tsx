import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { loraLink, timeAgo, type Payment } from "@/lib/energy-api";

export function PaymentLedger({ payments }: { payments: Payment[] | null }) {
  const rows = payments ?? [];
  const totalKwh = rows.reduce((s, p) => s + (p.kwh || 0), 0);
  const totalUsdc = rows.reduce((s, p) => s + (p.price_paid_usdc || 0), 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-6 text-[12px] text-muted-foreground">
          <span>
            <span className="tabular text-foreground">{rows.length}</span> tx
          </span>
          <span>
            <span className="tabular text-foreground">{totalKwh.toFixed(2)}</span> kWh
          </span>
          <span>
            <span className="tabular text-foreground">{totalUsdc.toFixed(4)}</span> USDC
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-background/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <th className="px-4 py-2 text-left font-medium">Time</th>
              <th className="px-4 py-2 text-right font-medium">kWh</th>
              <th className="px-4 py-2 text-right font-medium">USDC</th>
              <th className="px-4 py-2 text-left font-medium">Tx</th>
              <th className="px-4 py-2 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[13px] text-muted-foreground"
                  >
                    No payments yet. Plug in the EV to start.
                  </td>
                </tr>
              )}
              {rows.map((p) => (
                <motion.tr
                  key={p.tx_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-border last:border-0 hover:bg-background/40"
                >
                  <td className="px-4 py-2 text-muted-foreground">{timeAgo(p.ts)}</td>
                  <td className="tabular px-4 py-2 text-right text-foreground">
                    {p.kwh.toFixed(2)}
                  </td>
                  <td className="tabular px-4 py-2 text-right text-foreground">
                    {p.price_paid_usdc.toFixed(4)}
                  </td>
                  <td className="px-4 py-2 font-mono text-[12px] text-muted-foreground">
                    {p.tx_id.slice(0, 10)}…
                  </td>
                  <td className="px-4 py-2 text-right">
                    <a
                      href={loraLink(p)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-accent"
                    >
                      View <ExternalLink size={11} />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
