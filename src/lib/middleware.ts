import { createMiddleware } from "@tanstack/react-start";
import { getUser } from "~/server/api";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  console.log(user);

  // Return metadata to be available in onUploadComplete
  return await next({
    context: {
      userId: user.id,
      userEmail: user.email,
    },
  });
});
