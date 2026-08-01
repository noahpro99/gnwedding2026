import { createFileRoute } from "@tanstack/react-router";
import { BachelorFormScreen } from "~/components/BachelorFormScreen";

export const Route = createFileRoute("/bachelor")({
  head: () => ({ meta: [{ title: "Noah's Bachelor Party" }] }),
  component: BachelorPage,
});

function BachelorPage() {
  return <BachelorFormScreen />;
}
