import React from "react";

function CircleImage({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  return (
    <div className={`rounded-full overflow-hidden h-${size} w-${size}`}>
      <img className="object-cover w-full h-full" src={src} alt={alt} />
    </div>
  );
}

export default CircleImage;
