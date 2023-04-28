import React, { useState, useCallback } from "react";
import ReactCrop from "react-easy-crop";

function ImagePicker() {
  const [image, setImage] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const onFileChange = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setCroppedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {},
    [image]
  );

  return (
    <div>
      <input
        type="file"
        onChange={(event: any) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result);
            setCroppedImage(null);
          };
          reader.readAsDataURL(file);
        }}
      />
      {image && (
        <ReactCrop
          image={image}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      )}
      {croppedImage && (
        <div>
          <h2>Cropped Image Preview</h2>
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImage} />
        </div>
      )}
    </div>
  );
}

export default ImagePicker;
