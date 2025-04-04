'use client';
import React, { useState, ChangeEvent } from 'react';

interface ImageUploadProps {
    onUpload: (file: File) => void;
    imagePreview: string | null;
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  }
  

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload , imagePreview, setImagePreview }) => {

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('current file', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const handleAddNewImage = () => {
    setImagePreview(null);
    const input = document.getElementById('imageUpload') as HTMLInputElement;
    if (input) {
      input.value = ''; // Clear the input value
    }
  };

  return (
    <div className="text-center p-8">
      {imagePreview === null ? (
        <label
          htmlFor="imageUpload"
          className="px-8 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer inline-block mb-4"
        >
          Upload Image
        </label>
      ) : (
        <div className="flex flex-col mb-3 items-center">
          <p
            className="text-gray-300 text-center font-bold inline-block border-b border-gray-300"
            style={{ marginBottom: '3px' }}
          >
            Uploaded Image
          </p>
        </div>
      )}

      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview image */}
      {imagePreview && (
       <img
       src={imagePreview}
       alt="Preview"
       className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 rounded-2xl shadow-md mx-auto bg-gray-100 p-2 object-contain"
     />
     
      )}

{/* Add new Image button */}

      {imagePreview && (
      <label
      htmlFor="imageUpload"
      onClick={handleAddNewImage}
      className="mt-3 px-6 py-3 border-2 border-gray-300 rounded-lg cursor-pointer inline-flex items-center gap-2 bg-transparent text-gray-100 hover:bg-gray-300 hover:text-black transition duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-sm font-medium">Add New Image</span>
    </label>
    
      
      )}
    </div>
  );
};

export default ImageUpload;