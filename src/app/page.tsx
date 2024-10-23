'use client'
import Chat from "@/components/chat";
import Uploader from "@/components/Uploader";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isuploaded, setIsuploaded] = useState(false)

  const uploadHandler = async (formData: FormData) => {
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.data;
      if (result?.success) {
        setMessage(`File uploaded successfully: ${result.fileName}`);
        setIsuploaded(true)
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage("File upload failed.");
      console.log("ERROR UPLOADING FILE : ", error)
    }
  }

  return (
    <div className="min-h-screen">
      {
        !isuploaded
          ?
          <div className="h-screen flex justify-center items-center">
            < Uploader
              file={file}
              setFile={setFile}
              message={message}
              setMessage={setMessage}
              uploadHandler={uploadHandler}
            />
          </div>
          :
          <div className="">
            <Chat />
          </div>
      }
    </div>
  );
}
