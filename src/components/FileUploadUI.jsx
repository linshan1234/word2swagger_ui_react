import React, { useState, useCallback, useEffect } from "react"
import FileDropzone from "./FileDropzone"
import FileList from "./FileList"
import UploadConfirmModal from "./UploadConfirmModal"
import SuccessModal from "./SuccessModal"

const FileUploadUI = () => {
  const [files, setFiles] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredFile, setHoveredFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        uploadDate: new Date().toLocaleString(),
      }))
      setSelectedFiles(newFiles)
      setShowModal(true)
    }
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:6678/api/records")
      if (response.ok) {
        const data = await response.json()
        const formatted = data.map((file) => ({
          id: file.id,
          name: file.filename,
          uploadDate: file.created_at,
        }))
        setFiles(formatted)
      }
    } catch (err) {
      console.error("獲取歷史記錄錯誤：", err)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleUpload = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      selectedFiles.forEach((fileObj) => formData.append("docxfiles", fileObj.file))

      const response = await fetch("http://127.0.0.1:6678/api/records", {
        method: "POST",
        body: formData,
      })

      if (response.status === 200) {
        await fetchHistory()
        setShowModal(false)
        setShowSuccessModal(true)
        setSelectedFiles([])
      } else {
        alert(`上傳失敗：${response.statusText}`)
      }
    } catch (err) {
      console.error("上傳失敗：", err)
      alert("上傳失敗，請檢查 API 連線！")
    } finally {
      setIsLoading(false)
    }
  }

  const removeSelectedFile = (fileName) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName))
    if (selectedFiles.length <= 1) setShowModal(false)
  }

  const removeFile = async (fileId, fileName) => {
    const confirmDelete = window.confirm(`確定要刪除檔案「${fileName}」嗎？`)
    if (!confirmDelete) return

    try {
      const response = await fetch(`http://127.0.0.1:6678/api/record/${fileId}`, { method: "DELETE" })
      if (response.ok) {
        await fetchHistory()
      } else {
        alert(`刪除失敗：${response.statusText}`)
      }
    } catch (error) {
      alert("刪除失敗，請檢查 API 連線！")
    }
  }

  const handleFileClick = (id) => {
    window.open(`/preview/${id}`, "_blank")
  }

  // 幫你改這裡
  const handleEdit = (fileName) => {
    // 找到對應的檔案物件
    const targetFile = files.find(file => file.name === fileName)
    if (!targetFile) {
      console.log("找不到該檔案")
      return
    }
    window.open(`/edit/${targetFile.id}`)
  }

  const totalSize = selectedFiles.reduce((sum, file) => sum + parseFloat(file.size), 0).toFixed(2)
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / 10))

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      <div className="w-full md:w-1/3 flex items-center justify-center p-6">
        <FileDropzone onDrop={onDrop} />
      </div>

      <div className="w-full md:w-2/3 flex-1 flex flex-col bg-white md:border-l border-gray-200">
        <FileList
          files={filteredFiles}
          currentPage={currentPage}
          totalPages={totalPages}
          hoveredFile={hoveredFile}
          setHoveredFile={setHoveredFile}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClearSearch={() => setSearchQuery("")}
          onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))}
          onEdit={handleEdit}
          onDelete={removeFile}
          onFileClick={handleFileClick}
        />
      </div>

      {showModal && selectedFiles.length > 0 && (
        <UploadConfirmModal
          selectedFiles={selectedFiles}
          totalSize={totalSize}
          onClose={() => setShowModal(false)}
          onUpload={handleUpload}
          onRemove={removeSelectedFile}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="text-white mt-4">正在上傳，請稍候...</p>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} fileCount={selectedFiles.length || 0} />
      )}
    </div>
  )
}

export default FileUploadUI
