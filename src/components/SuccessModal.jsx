import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const SuccessModal = ({ onClose, fileCount }) => {
  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center">
          <CheckCircle size={60} className="text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">上傳成功！</h3>
          <p className="text-sm text-gray-600 mb-4">
            {fileCount > 0 ? `成功上傳 ${fileCount} 個檔案。` : "檔案已成功上傳。"}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <motion.button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
          >
            關閉
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default SuccessModal

