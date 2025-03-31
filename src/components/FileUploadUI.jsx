import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Trash2, Edit2, UploadCloud, FileText, Search, ChevronLeft, ChevronRight, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FileUploadUI = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // 處理拖曳或選擇檔案
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0] // 只處理第一個選中的檔案
      const newFile = {
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(2), // 轉換 KB
        uploadDate: new Date().toLocaleString(),
      }
      setSelectedFile(newFile)
      setShowModal(true) // 顯示彈跳視窗
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  // 刪除檔案
  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  // 上傳檔案 API
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("請先選擇一個檔案！")
      return
    }

    const formData = new FormData()
    formData.append("docxfile", selectedFile.file)

    try {
      const response = await fetch("http://127.0.0.1:6688/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("檔案上傳成功！")
        setFiles((prevFiles) => [...prevFiles, selectedFile]) // 將已上傳檔案加入檔案列表
        setShowModal(false) // 關閉彈跳視窗
        setSelectedFile(null) // 重置選擇的檔案
      } else {
        alert(`上傳失敗：${response.statusText}`)
      }
    } catch (error) {
      console.error("上傳時發生錯誤：", error)
      alert("上傳失敗，請檢查 API 連線！")
    }
  }

  // 關閉彈跳視窗
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedFile(null)
  }

  const handleEdit = (fileName) => {
    console.log(`編輯功能尚未實作：${fileName}`)
  }

  // 過濾檔案名稱
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // 分頁處理
  const itemsPerPage = 5
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / itemsPerPage))
  const paginatedFiles = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // 當搜尋條件變更時，重置頁碼
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Left Panel: Upload */}
      <div className="w-full md:w-1/3 flex items-center justify-center p-4 md:p-6">
        <motion.div
          {...getRootProps()}
          className={`w-full h-[300px] md:h-[400px] bg-white p-4 md:p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-500 shadow-lg flex flex-col items-center justify-center ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto mb-4 text-gray-500" size={64} />
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
      </div>

      {/* Right Panel: File List - 移除了多餘的間距，讓它切齊邊緣 */}
      <div className="w-full md:w-2/3 flex-1 flex flex-col bg-white md:border-l border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">已上傳的檔案</h2>

          {/* 優化後的搜尋框 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜尋檔案名稱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 可滾動的檔案列表 - 移除了內邊距，讓內容更貼近邊緣 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="text-lg">{searchQuery ? "沒有符合搜尋條件的檔案" : "目前沒有檔案"}</p>
              <p className="text-sm mt-2">{searchQuery ? "請嘗試其他關鍵字" : "上傳檔案將會顯示在這裡"}</p>
            </div>
          ) : (
            <AnimatePresence>
              <ul className="divide-y divide-gray-100">
                {paginatedFiles.map((file, index) => (
                  <motion.li
                    key={file.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1">
                          <p className="text-xs text-gray-500">{file.size} KB</p>
                          <p className="text-xs text-gray-500">上傳時間：{file.uploadDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(file.name)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFile(file.name)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </AnimatePresence>
          )}
        </div>

        {/* 分頁控制 */}
        {filteredFiles.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-gray-600">
              顯示 {filteredFiles.length} 個檔案中的{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredFiles.length)} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredFiles.length)} 個
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center justify-center ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 rounded-lg flex items-center justify-center ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 確認上傳的彈跳視窗 */}
      {showModal && selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">確認上傳</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-600">
                <XCircle size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600">檔案名稱：{selectedFile.name}</p>
            <p className="text-sm text-gray-600">大小：{selectedFile.size} KB</p>
            <div className="flex justify-end mt-6 space-x-3">
              <motion.button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                取消
              </motion.button>
              <motion.button
                onClick={handleUpload}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                whileHover={{ scale: 1.05 }}
              >
                確認上傳
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadUI