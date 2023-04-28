import React, { createRef, useRef, useState } from "react";
import axios from "axios";
import uploadImageBlob from "../helpers/uploadImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);

  const [previewImage, setPreviewImage] = useState("");
  const captionRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const handleFileSelect = async (event: any) => {
    setSelectedFile(event.target.files[0]);
    const imageBase64 = await blobToBase64(event.target.files[0]);
    setPreviewImage(imageBase64 as string);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const resetFields = () => {
    setSelectedFile(null);
    fileInputRef.current!.value = "";
    captionRef.current!.value = "";
  };
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        "https://petster-server-production.up.railway.app/check-animal",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      if (response.data.hasAnimals) {
        console.log("continue", selectedFile);
        // firebase upload
        const postId = await uploadImageBlob(
          {
            profileName: session?.user?.name,
            username: session?.user?.email,
            profileImg: session?.user?.image,
            caption: captionRef.current?.value ?? "",
          },
          selectedFile
        );
        resetFields();
        setIsUploading(false);
        setTimeout(() => {
          router.push(`/post/${postId}`);
        }, 300);
      } else if (!response.data.hasAnimals) {
        alert("the image needs to contain your pet");
        setSelectedFile(null);
        fileInputRef.current!.value = "";
        setIsUploading(false);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="bg-gray-200 border border-gray-300 rounded shadow-sm px-4  py-3  my-10 max-w-xl">
      <h1 className="ml-2 mt-1 mb-3 font-medium text-lg">
        Share your pet&#39;s photo:
      </h1>

      <input
        // className="rounded border border-gray-100 flex w-full h-12"
        // className="w-full h-full  placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
        className="bg-gray-100 border border-gray-400 rounded text-gray w-full mr-3 py-4 px-4"
        type="text"
        ref={captionRef}
        placeholder="Add caption..."
      />
      <div className="flex flex-col mt-5 ">
        <h1 className="ml-2 mb-2 text-sm">Choose photo:</h1>
        <div className="flex flex-col items-center gap-5">
          {/* <input type="file" onChange={handleFileSelect} /> */}
          <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500 truncate">
              {selectedFile ? selectedFile.name : "Select a file:"}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
              onClick={handleClick}
            >
              {selectedFile ? "Change" : "Insert Image"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
          </div>
          {selectedFile ? (
            <div>
              <img src={previewImage} alt="" />
            </div>
          ) : (
            ""
          )}
          {selectedFile ? (
            isUploading ? (
              error ? (
                <h1>error occurred</h1>
              ) : (
                <h1>uploading...</h1>
              )
            ) : (
              <button
                className="h-14 border border-blue-400 hover:bg-blue-300 font-semibold py-2 px-4 rounded"
                onClick={handleUpload}
              >
                Upload
              </button>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
