import React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"
import { motion } from "framer-motion"

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  const dropzoneProps = getRootProps();

  return (
    <div
      {...dropzoneProps}
      className="..."
    >
      <input {...getInputProps()} />
      <UploadCloud className="mb-4 text-gray-500" size={64} />
      <p className="text-gray-700 font-medium">請拖曳 .docx 檔案或點擊上傳</p>
      <motion.button
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
      >
        選擇檔案
      </motion.button>
    </div>
  )
}

export default FileDropzone