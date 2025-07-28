import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getUser } from "~/server/auth";

const f = createUploadthing();

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const ourFileRouter = {
  // Vehicle image uploader
  vehicleImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      // Get the authenticated user
      const user = await getUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      // Return metadata to be available in onUploadComplete
      return {
        userId: user.id,
        userEmail: user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // Return data to the client
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
