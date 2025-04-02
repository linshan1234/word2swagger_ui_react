import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ExternalLink, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"

const FileList = ({
  files,
  currentPage,
  totalPages,
  hoveredFile,
  onSearchChange,
  onClearSearch,
  onEdit,
  onDelete,
  onPageChange,
  onFileClick,
  searchQuery,
  setHoveredFile,
}) => {
  const itemsPerPage = 10
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const paginatedFiles = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      {/* 搜尋框 */}
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜尋檔案名稱..."
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button onClick={onClearSearch} className="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-600">
              ×
            </button>
          )}
        </div>
      </div>

      {/* 檔案列表 */}
      <div className="flex-1 overflow-y-auto">
        {paginatedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <FileText size={48} className="mb-4 opacity-50" />
            <p className="text-lg">{searchQuery ? "沒有符合搜尋條件的檔案" : "目前沒有檔案"}</p>
          </div>
        ) : (
          <AnimatePresence>
            <ul className="divide-y divide-gray-100">
              {paginatedFiles.map((file) => (
                <motion.li
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-between items-center p-4 hover:bg-gray-50"
                  onMouseEnter={() => setHoveredFile(file.id)}
                  onMouseLeave={() => setHoveredFile(null)}
                >
                  <div className="flex items-center flex-1 cursor-pointer" onClick={() => onFileClick(file.id, file.name)}>
                    <FileText className="text-blue-600 mr-3" />
                    <div>
                      <p className={`font-medium ${hoveredFile === file.id ? "text-blue-600" : "text-gray-800"}`}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">上傳時間：{file.uploadDate}</p>
                    </div>
                    {hoveredFile === file.id && <ExternalLink size={14} className="ml-2 text-blue-500" />}
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => onEdit(file.name)}><Edit2 size={18} className="text-blue-500" /></button>
                    <button onClick={() => onDelete(file.id, file.name)}><Trash2 size={18} className="text-red-500" /></button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </div>

      {/* 分頁控制 */}
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          顯示 {filteredFiles.length} 個中的 {(currentPage - 1) * itemsPerPage + 1} -
          {Math.min(currentPage * itemsPerPage, filteredFiles.length)} 個
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-blue-600 disabled:text-gray-400"
          >
            <ChevronLeft size={20} />
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-blue-600 disabled:text-gray-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  )
}

export default FileList
