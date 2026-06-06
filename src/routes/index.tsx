import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "P2P Agentic Energy Sharing" },
      {
        name: "description",
        content:
          "Your EV autonomously buys cheap solar from your neighbor and pays instantly via x402 on Algorand.",
      },
      { property: "og:title", content: "P2P Agentic Energy Sharing" },
      {
        property: "og:description",
        content:
          "Autonomous EV agent buying surplus solar and settling on-chain USDC payments in real time.",
      },
    ],
  }),
  component: Dashboard,
});
