import React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"
import { motion } from "framer-motion"

const FileDropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
  })

  return (
    <motion.div
      {...getRootProps()}
      className={`w-full h-[300px] md:h-[400px] bg-white p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-blue-500 shadow-lg flex flex-col items-center justify-center ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
    </motion.div>
  )
}

export default FileDropzone
