import React from "react"
import { motion } from "framer-motion"
import { XCircle, File } from "lucide-react"

const UploadConfirmModal = ({ selectedFiles, totalSize, onClose, onUpload, onRemove }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">檔案確認</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600">
          <XCircle size={20} />
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          選擇了 {selectedFiles.length} 個檔案，總大小：{totalSize} KB
        </p>
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {selectedFiles.map((file) => (
            <div key={file.name} className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
              <div className="flex items-center">
                <File size={16} className="text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size} KB</p>
                </div>
              </div>
              <button onClick={() => onRemove(file.name)} className="text-red-500 hover:text-red-700 p-1">
                <XCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-3">
        <motion.button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
          取消
        </motion.button>
        <motion.button onClick={onUpload} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          確認上傳
        </motion.button>
      </div>
    </div>
  </div>
)

export default UploadConfirmModal
