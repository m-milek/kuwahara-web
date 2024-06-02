'use server'

export type FormState = {
  message: string;
}

export async function uploadImage(prevState: FormState, formData: FormData): Promise<FormState> {
  const filterSize = formData.get("filter-size");
  if (!filterSize) {
    return {
      message: "No filter size provided"
    }
  }

  const image = formData.get("image") as File | undefined;
  if (!image) {
    return {
      message: "No image provided"
    }
  }

  const imageSize = image.size / 1024 / 1024;
  if (imageSize > 5) {
    return {
      message: "Image size is too large. Maximum size is 5MB."
    }
  }

  try {
    const response = await fetch("http://localhost:8080/kuwahara", {
      method: "POST",
      body: formData
    });
    const byteArray = new Uint8Array(await response.arrayBuffer());
    const base64 = btoa(new Uint8Array(byteArray).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, ''));
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
