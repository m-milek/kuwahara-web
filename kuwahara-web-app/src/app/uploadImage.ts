'use server'

export type FormState = {
  message: string;
}

export async function uploadImage(prevState: FormState, formData: FormData): Promise<FormState> {
  "use server"
  console.log("Uploading image...");
  const filterSize = formData.get("filter-size");
  if (!filterSize) {
    console.error("No filter size provided");
    return {
      message: "No filter size provided"
    }
  }

  const image = formData.get("image") as File | undefined;
  if (!image) {
    console.error("No image provided");
    return {
      message: "No image provided"
    }
  }

  const imageSize = image.size / 1024 / 1024;
  if (imageSize > 5) {
    console.error("Image size is too large. Maximum size is 5MB.");
    return {
      message: "Image size is too large. Maximum size is 5MB."
    }
  }

  try {
    console.log("Processing image...");
    const response = await fetch("http://localhost:8080/kuwahara", {
      method: "POST",
      body: formData
    });
    console.log("Fetch finished");
    const byteArray = new Uint8Array(await response.arrayBuffer());
    console.log("Array buffer received")
    const base64 = btoa(new Uint8Array(byteArray).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, ''));
    console.log("Image processed successfully");
    return {
      message: base64
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error processing form data"
    }
  }
}
