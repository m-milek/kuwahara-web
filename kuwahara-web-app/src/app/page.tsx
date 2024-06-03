"use client";
import { Suspense, useState } from "react";
import { FormState } from "./uploadImage";
import { uploadImage } from "./uploadImage";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import ImageContainer from "./ImageContainer";

const initialState: FormState = {
  message: ""
};

function FilterSizeInput(props: {
  filterSize: number;
  setFilterSize: Function;
}) {
  return (
    <>
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
    </>
  );
}

function ImageForm(props: {
  filterSize: number;
  setFilterSize: Function;
  setImageUrl: Function;
  setFilteredImageUrl: any;
  setImageIsProcessing: Function;
}) {
  const [message, setMessage] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    props.setImageIsProcessing(true);
    uploadImage({ message: "" }, formData).then(res => {
      props.setFilteredImageUrl(res.message);
      props.setImageIsProcessing(false);
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <div>{message}</div>
      <FilterSizeInput
        filterSize={props.filterSize}
        setFilterSize={props.setFilterSize}
      />
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

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4"
      >
        Submit
      </button>
    </form>
  );
}

export default function Home() {
  const [filterSize, setFilterSize] = useState(9);
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [filteredImageUrl, setFilteredImageUrl] = useState<null | string>(null);
  const [isImageProcessing, setIsImageProcessing] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-6xl m-4">Kuwahara Filter Online</h1>
      <div>Upload an image</div>
      <ImageForm
        filterSize={filterSize}
        setFilterSize={setFilterSize}
        setImageUrl={setImageUrl}
        setFilteredImageUrl={setFilteredImageUrl}
        setImageIsProcessing={setIsImageProcessing}
      />
      <ImageContainer
        firstImageSrc={imageUrl}
        secondImageSrc={`data:${"image/png"};base64,${filteredImageUrl}`}
        isImageProcessing={isImageProcessing}
      />
    </main>
  );
}
