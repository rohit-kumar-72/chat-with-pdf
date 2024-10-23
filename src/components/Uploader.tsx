'use client'
import { useState, ChangeEvent } from "react";

interface FileUploadProps {
    file: File | null;
    setFile: (file: File | null) => void;
    message: string;
    setMessage: (message: string) => void;
    uploadHandler: (formData: FormData) => void;
}

const Uploader: React.FC<FileUploadProps> = (
    { file, setFile, message, setMessage, uploadHandler }) => {

    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]); // get the first file from the selected files
        }
    };

    const handleUpload = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        // Array.from(formData.entries()).forEach(([key, value]) => {
        //     console.log(`${key}:`, value);
        // });

        setUploading(true);
        setMessage("");

        await uploadHandler(formData)

        setUploading(false);

    };

    return (
        <form onSubmit={handleUpload}>
            <div className="flex flex-col items-center justify-center p-6 border rounded-md shadow-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mb-4 p-2 border rounded-md"
                />
                <button
                    type="submit"
                    disabled={uploading}
                    className={`px-4 py-2 rounded-md text-white font-semibold ${uploading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
                {message && (
                    <p className="mt-4 text-red-400 text-center text-sm">{message}</p>
                )}
            </div>
        </form>
    );
};

export default Uploader;
