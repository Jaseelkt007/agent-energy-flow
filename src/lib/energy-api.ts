export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:4021";

export type AgentState =
  | "IDLE"
  | "EVALUATING"
  | "PAYING"
  | "CHARGING"
  | "WAITING"
  | "ERROR";

export type Health = "ok" | "stale" | "down";

export interface Snapshot {
  producer: {
    solar_kw: number;
    battery_pct: number;
    price_per_kwh: number;
    ev_plugged: boolean;
    has_offer: boolean;
    stale: boolean;
  };
  agent: {
    state: AgentState;
    delivery_remaining_kwh: number;
    budget_remaining_usdc: number;
    max_price_per_kwh: number;
    decision_reason?: string;
    last_tx_id?: string;
  };
  totals: {
    sold_kwh: number;
    spent_usdc: number;
    tx_count: number;
    ev_power_kw: number;
  };
  health: { producer: Health; x402: Health; agent: Health };
}

export interface Payment {
  ts: number;
  kwh: number;
  price_paid_usdc: number;
  tx_id: string;
  lora_url?: string;
}

export interface EventItem {
  ts: number;
  type: "STATE" | "DECISION" | "PAYMENT" | "ERROR";
  message: string;
  kwh?: number;
  price_usdc?: number;
  tx_id?: string;
  lora_url?: string;
}

export interface HistoryPoint {
  ts: number;
  solar_kw?: number;
  price_per_kwh?: number;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

export const api = {
  snapshot: () => getJSON<Snapshot>("/api/snapshot"),
  payments: () => getJSON<Payment[]>("/api/payments"),
  events: () => getJSON<EventItem[]>("/api/events?limit=100"),
  history: () =>
    getJSON<any[]>("/api/history?minutes=10").then((rows) =>
      (Array.isArray(rows) ? rows : []).map((r): HistoryPoint => ({
        ts: Number(r.ts ?? r.timestamp ?? r.time ?? 0),
        solar_kw: typeof r.solar_kw === "number" ? r.solar_kw : undefined,
        price_per_kwh:
          typeof r.price_per_kwh === "number" ? r.price_per_kwh : undefined,
      })),
    ),
};

export async function postControl(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
}

export function loraLink(p: { tx_id: string; lora_url?: string }): string {
  return p.lora_url || `https://lora.algokit.io/testnet/tx/${p.tx_id}`;
}

export function timeAgo(tsSec: number): string {
  const diff = Math.max(0, Date.now() / 1000 - tsSec);
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
