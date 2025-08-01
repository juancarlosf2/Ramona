// src/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);

// Export default for Vinxi
export default function Client() {
  return <StartClient router={router} />;
}
