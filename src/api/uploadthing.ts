import { createAPIFileRoute } from "@tanstack/react-start/api";

import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "~/lib/uploadthing";

const handlers = createRouteHandler({ router: ourFileRouter });

export const APIRoute = createAPIFileRoute("/api/uploadthing")({
  GET: handlers,
  POST: handlers,
});
