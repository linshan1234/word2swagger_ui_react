import React from 'react';
import { X } from 'lucide-react';

interface SelectedFileType {
  file: File;
  name: string;
  size: number;
}

interface UploadConfirmModalProps {
  selectedFiles: SelectedFileType[];
  totalSize: number;
  onUpload: () => void;
  onClose: () => void;
  onRemove: (fileName: string) => void;
}

export default function UploadConfirmModal({
  selectedFiles,
  totalSize,
  onUpload,
  onClose,
  onRemove,
}: UploadConfirmModalProps) {
  // 格式化檔案大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">確認上傳檔案</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto mb-4">
          <ul className="space-y-2">
            {selectedFiles.map((file) => (
              <li key={file.name} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <div className="truncate flex-1 mr-2">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button 
                  className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded"
                  onClick={() => onRemove(file.name)}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          總計: {selectedFiles.length} 個檔案 ({formatFileSize(totalSize)})
        </div>
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button 
            onClick={onUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            確認上傳
          </button>
        </div>
      </div>
    </div>
  );
}