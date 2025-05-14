import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/clients/$purchasedById")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authed/clients/$purchasedById"!</div>;
}
