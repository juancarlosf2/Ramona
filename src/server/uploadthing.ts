import { UTApi } from "uploadthing/server";

// Initialize UTApi instance
const utapi = new UTApi();

/**
 * Upload multiple image files to UploadThing with optimized parallel processing
 * @param files Array of File objects to upload
 * @returns Promise resolving to array of upload URLs
 */
export async function uploadVehicleImages(files: File[]): Promise<string[]> {
  try {
    console.log(`Starting parallel upload of ${files.length} files...`);

    // For better performance, we can upload files individually in parallel
    // This gives us better control over individual failures
    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await utapi.uploadFiles([file]);
        if (result[0]?.data) {
          console.log(
            `✅ Upload ${index + 1}/${files.length} completed: ${file.name}`
          );
          return result[0].data.ufsUrl;
        } else {
          const error = result[0]?.error?.message || "Unknown upload error";
          console.error(
            `❌ Upload ${index + 1}/${files.length} failed: ${file.name} - ${error}`
          );
          throw new Error(`Failed to upload ${file.name}: ${error}`);
        }
      } catch (error) {
        console.error(
          `❌ Upload ${index + 1}/${files.length} failed: ${file.name}`,
          error
        );
        throw new Error(
          `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    });

    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled(uploadPromises);

    const uploadedUrls: string[] = [];
    const failures: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        uploadedUrls.push(result.value);
      } else {
        failures.push(`${files[index].name}: ${result.reason}`);
      }
    });

    // If we have any failures, log them but decide whether to fail completely
    if (failures.length > 0) {
      console.warn(`Some uploads failed: ${failures.join(", ")}`);

      // Fail completely if no uploads succeeded
      if (uploadedUrls.length === 0) {
        throw new Error(`All uploads failed: ${failures.join(", ")}`);
      }

      // Warn but continue if some uploads succeeded
      console.warn(
        `Partial upload success: ${uploadedUrls.length}/${files.length} files uploaded successfully`
      );
    }

    console.log(
      `✅ Upload completed: ${uploadedUrls.length}/${files.length} files uploaded successfully`
    );
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading vehicle images:", error);
    throw new Error("Failed to upload images to UploadThing");
  }
}

/**
 * Delete files from UploadThing by URL
 * @param urls Array of file URLs to delete
 */
export async function deleteVehicleImages(urls: string[]): Promise<void> {
  try {
    // Extract file keys from URLs
    const fileKeys = urls.map((url) => {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    });

    await utapi.deleteFiles(fileKeys);
  } catch (error) {
    console.error("Error deleting vehicle images:", error);
    // Don't throw here as this is cleanup - log the error but continue
  }
}
