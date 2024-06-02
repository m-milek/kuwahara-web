"use client";
import { useState } from "react";
import { FormState } from "./uploadImage";
import { uploadImage } from "./uploadImage";
import Image from "next/image";
import { useFormState } from "react-dom";

const initialState: FormState = {
  message: ""
};

function ImageForm(props: {
  filterSize: number;
  setFilterSize: Function;
  setImageUrl: Function;
  formAction: any;
}) {
  return (
    <form action={props.formAction} className="flex flex-col items-center">
      <input
        name="filter-size"
        type="range"
        value={props.filterSize}
        min="3"
        max="15"
        step={"2"}
        onInput={(e: any) => props.setFilterSize(e.target.value)}
      />
      {props.filterSize}

      <label className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4">
        <input
          className="hidden"
          name="image"
          type="file"
          accept="image/jpeg, image/png"
          required
          onInput={(e: any) => {
            const url = URL.createObjectURL(e.target.files[0]);
            props.setImageUrl(url);
          }}
        />
        Select Image
      </label>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4">
        Submit
      </button>
    </form>
  );
}

function ImageContainer(props: {
  firstImageSrc: string | null;
  secondImageSrc: string | null;
}) {
  const imageSize = 400;
  return (
    <div className="max-w-max h-96 items-center border-4 border-black flex flex-row flex-grow-0 flex-1">
      {[props.firstImageSrc, props.secondImageSrc].map(
        src =>
          src ? (
            <Image
              src={src}
              className="max-h-full max-w-full object-contain"
              placeholder="empty"
              width={imageSize}
              height={imageSize}
              alt="Your image"
            />
          ) : (
            <ImagePlaceholder size={imageSize} />
          )
      )}
    </div>
  );
}

function ImagePlaceholder(props: { size: number }) {
  return <div className={`w-[${props.size}px] h-full color-gray-200`} />;
}

export default function Home() {
  const [filterSize, setFilterSize] = useState(9);
  const [imageUrl, setImageUrl] = useState<null | string>(null);

  const [formState, formAction] = useFormState(uploadImage, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-6xl m-4">Kuwahara Filter Online</h1>
      <div>Upload an image</div>
      <ImageForm
        filterSize={filterSize}
        setFilterSize={setFilterSize}
        setImageUrl={setImageUrl}
        formAction={formAction}
      />
      <ImageContainer
        firstImageSrc={imageUrl}
        secondImageSrc={`data:${"image/png"};base64,${formState.message}`}
      />
    </main>
  );
}
