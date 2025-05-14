import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/contracts/$contractId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/contracts/$contractId/"!</div>
}
