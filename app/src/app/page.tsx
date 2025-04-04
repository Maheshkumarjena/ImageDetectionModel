'use client'
import Image from "next/image";
import React, { useState } from "react";
// import { Inter } from "next/font/google";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import ImageUpload from "@/Components/ImageUploader";
import AnalysisResult from "@/Components/AnalysisResult";
import ErrorDisplay from "@/Components/ErrorDisplay";
import LoadingSpinner from "@/Components/SpinLoader";


interface AnalysisResultData {
  aiProbability: number;
  photoshopProbability: number;
  originalProbability: number;
  extraData?: string;
  label: string;
  confidence: number;
}

const Home: React.FC = () => {

  const [result, setResult] = useState<AnalysisResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: AnalysisResultData = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900  items-center flex-col">
      <Header />

      <div className="flex justify-center items-center flex-col pt-4 ">
        <h1 className="text-4xl text-white font-bold mb-4">Image Analysis</h1>
        <p className="text-gray-300">Upload an image to analyze its content.</p>
      </div>

      <LoadingSpinner isLoading={isLoading} />

      {result ? (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full p-4 md:p-8 gap-6 pb-24">
    <div className="w-full md:w-1/2 flex justify-center">
      <ImageUpload
        onUpload={handleImageUpload}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
    </div>
    <div className="w-full md:w-1/2 flex justify-center">
      <AnalysisResult result={result} />
    </div>
  </div>
) : (
  <div className="flex justify-center items-center w-full">
    <ImageUpload
      onUpload={handleImageUpload}
      imagePreview={imagePreview}
      setImagePreview={setImagePreview}
    />
  </div>
)}


      <ErrorDisplay errorMessage={errorMessage} />
      <div className="fixed bottom-0 left-0 w-full ">

        <Footer />
      </div>
    </div>
  );
}

export default Home;