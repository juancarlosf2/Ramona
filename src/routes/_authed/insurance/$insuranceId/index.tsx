import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/insurance/$insuranceId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authed/insurance/$insuranceId"!</div>;
}
