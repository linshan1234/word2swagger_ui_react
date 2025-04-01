"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import {
  Trash2,
  Edit2,
  UploadCloud,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  File,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SuccessModal from "./SuccessModal"

const FileUploadUI = () => {
  const [files, setFiles] = useState([])
  const [setSelectedFile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([]) // 修改為數組以支持多個檔案
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredFile, setHoveredFile] = useState(null)

  // 處理拖曳或選擇檔案 - 修改為支持多個檔案
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(2), // 轉換 KB
        uploadDate: new Date().toLocaleString(),
      }))

      setSelectedFiles(newFiles)
      setShowModal(true) // 顯示彈跳視窗
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  // 從選擇的檔案中移除
  const removeSelectedFile = (fileName) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
    if (selectedFiles.length <= 1) {
      setShowModal(false) // 如果沒有檔案了，關閉視窗
    }
  }

  // 刪除檔案
  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  // 開啟檔案在新視窗
  const openFileInNewWindow = (fileId, fileName) => {
    // 假設檔案的URL是基於ID的
    const fileUrl = `http://127.0.0.1:6688/api/files/${fileId}`
    window.open(fileUrl, "_blank")
    console.log(`開啟檔案: ${fileName}`)
  }

  // 取得上傳歷史記錄的 API
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:6688/api/history")
      if (response.ok) {
        const data = await response.json()

        // 解析 API 數據，格式化成檔案列表
        const formattedData = data.map((file) => ({
          name: file.filename, // 將 filename 作為 name
          uploadDate: file.created_at, // 將 created_at 作為上傳時間
          id: file.id,
        }))

        setFiles(formattedData) // 更新 files 狀態
      } else {
        console.error("無法取得歷史記錄：", response.statusText)
      }
    } catch (error) {
      console.error("獲取歷史記錄時發生錯誤：", error)
    }
  }

  // 修改 handleUpload：在成功上傳後調用 fetchHistory
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("請先選擇檔案！")
      return
    }

    try {
      const formData = new FormData()
      formData.append("docxfile", selectedFiles[0].file) // ✅ 上傳第一個檔案

      const response = await fetch("http://127.0.0.1:6688/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.status === 200) {
        // 更新檔案列表
        await fetchHistory() // ✅ 上傳成功後自動取得歷史記錄
        setShowModal(false) // 關閉上傳確認視窗
        setShowSuccessModal(true) // 顯示成功視窗
        setSelectedFiles([]) // 重置選擇的檔案
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

  // 關閉成功視窗
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
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

  // 計算所選檔案的總大小
  const totalSize = selectedFiles.reduce((sum, file) => sum + Number.parseFloat(file.size), 0).toFixed(2)

  // 當搜尋條件變更時，重置頁碼
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // 初始化時獲取歷史記錄
  useEffect(() => {
    fetchHistory()
  }, [])

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

        {/* 可滾動的檔案列表 - 更新顯示檔名和上傳時間 */}
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
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200"
                    onMouseEnter={() => setHoveredFile(file.id)}
                    onMouseLeave={() => setHoveredFile(null)}
                  >
                    <div className="flex items-center flex-1">
                      <motion.div
                        className="bg-blue-100 p-2 rounded-lg mr-4"
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, 2, -2, 0], // 小幅旋轉以增加動感
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                      >
                        <FileText size={24} className="text-blue-600" />
                      </motion.div>
                      <div className="flex-1">
                        {/* 檔名動畫 + 點擊功能 */}
                        <motion.div
                          onClick={() => openFileInNewWindow(file.id, file.name)}
                          className="group cursor-pointer"
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.p
                            className={`text-sm font-medium ${
                              hoveredFile === file.id ? "text-blue-600" : "text-gray-800"
                            } transition-colors duration-200 flex items-center`}
                            animate={
                              hoveredFile === file.id
                                ? {
                                    scale: 1.02,
                                    textShadow: [
                                      "0px 0px 0px rgba(59, 130, 246, 0)",
                                      "0px 0px 6px rgba(59, 130, 246, 0.4)",
                                      "0px 0px 0px rgba(59, 130, 246, 0)",
                                    ],
                                  }
                                : { scale: 1 }
                            }
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            {file.name}
                            {hoveredFile === file.id && (
                              <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                                className="ml-2 text-blue-500"
                              >
                                <ExternalLink size={14} />
                              </motion.span>
                            )}
                          </motion.p>
                        </motion.div>
                        <p className="text-xs text-gray-500">上傳時間：{file.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#e0f2fe" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(file.name)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 15,
                        }}
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFile(file.name)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 15,
                        }}
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

      {/* 確認上傳的彈跳視窗 - 修改為顯示多個檔案 */}
      {showModal && selectedFiles.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">確認上傳</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                選擇了 {selectedFiles.length} 個檔案，總大小：{totalSize} KB
              </p>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {selectedFiles.map((file, index) => (
                  <div
                    key={file.name}
                    className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <File size={16} className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSelectedFile(file.name)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
      {/* 成功上傳的動畫視窗 */}
      <AnimatePresence>
        {showSuccessModal && <SuccessModal onClose={handleCloseSuccessModal} fileCount={selectedFiles.length || 0} />}
      </AnimatePresence>
    </div>
  )
}

export default FileUploadUI

