import { createFileRoute } from "@tanstack/react-router";
import { NewConcesionarioForm } from "~/components/concesionarios/new-concesionario-form";

export const Route = createFileRoute("/_authed/consignments/new")({
  component: NewConcesionarioPage,
});

function NewConcesionarioPage() {
  return (
    <div className="container py-8 animate-in fade-in-50 duration-500">
      <NewConcesionarioForm />
    </div>
  );
}
