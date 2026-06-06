import { AnimatePresence, motion } from "framer-motion";
import { timeAgo, type EventItem } from "@/lib/energy-api";
import { cn } from "@/lib/utils";

function icon(type: EventItem["type"]) {
  switch (type) {
    case "PAYMENT":
      return "💸";
    case "DECISION":
      return "🤔";
    case "ERROR":
      return "⚠️";
    default:
      return "·";
  }
}

export function EventFeed({ events }: { events: EventItem[] | null }) {
  const rows = (events ?? []).slice(0, 60);
  return (
    <div className="max-h-[320px] overflow-y-auto sm:max-h-[420px]">
      <AnimatePresence initial={false}>
        {rows.length === 0 && (
          <p className="py-8 text-center text-[13px] text-muted-foreground">
            No events yet.
          </p>
        )}
        <ul className="space-y-1">
          {rows.map((e, i) => (
            <motion.li
              key={`${e.ts}-${i}-${e.type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 rounded-md px-2 py-1.5 text-[13px] hover:bg-background/40"
            >
              <span className="mt-px w-4 text-center text-[12px] text-muted-foreground">
                {icon(e.type)}
              </span>
              <span
                className={cn(
                  "tabular w-16 shrink-0 text-[12px] text-muted-foreground",
                )}
              >
                {timeAgo(e.ts)}
              </span>
              <span className="flex-1 text-foreground">{e.message}</span>
              {e.tx_id && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  {e.tx_id.slice(0, 8)}…
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
}
