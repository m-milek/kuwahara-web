import Image from "next/image";
import { Suspense } from "react";

function ImagePlaceholder(props: { size: number }) {
  return <div className={`w-[${props.size}px] h-full color-gray-300`} />;
}

export default function ImageContainer(props: {
  firstImageSrc: string | null;
  secondImageSrc: string | null;
  isImageProcessing: boolean;
}) {
  const imageSize = 400;
  return (
    <div className="max-w-max h-96 items-center border-4 border-black flex flex-row flex-grow-0 flex-1">
      <Image
        src={props.firstImageSrc ? props.firstImageSrc : "/empty.png"}
        className="max-h-full max-w-full object-contain"
        placeholder="empty"
        width={imageSize}
        height={imageSize}
        alt="Your image"
      />
      {!props.isImageProcessing ? (
        <Image
          src={props.secondImageSrc ? props.secondImageSrc : "/empty.png"}
          className="max-h-full max-w-full object-contain"
          placeholder="empty"
          width={imageSize}
          height={imageSize}
          alt="Your image"
        />
      ) : (
        <p className={`w-[${imageSize} h-[${imageSize}]`}>Loading...</p>
      )}
    </div>
  );
}
