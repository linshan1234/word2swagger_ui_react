"use client";

import React, { useState, useEffect } from 'react';
import { Folder, FolderPlus, Upload, Edit2, Check, X, Trash2 } from 'lucide-react';
import { API } from './api/api';
import { request } from './api/request';
import UploadConfirmModal from "./components/UploadConfirmModal";
import CreateFolderModal from "./components/CreateFolderModal";

interface FileType {
  fileID: string;
  fileName: string;
  createdAt: string;
}

interface FolderType {
  folderID: string;
  folderName: string;
  files: FileType[];
}

interface SelectedFileType {
  file: File;
  name: string;
  size: number;
}

export default function App() {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [folderFiles, setFolderFiles] = useState<FileType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileType[]>([]);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  useEffect(() => { fetchFolders(); }, []);

  const fetchFolders = async () => {
    try {
      const result = await request(API.FILES);
      setFolders(result.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    await fetch(API.FOLDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolderName.trim() }),
    });
    await fetchFolders();
    setNewFolderName('');
  };

  const deleteFolder = async (folderId: string) => {
    if (!window.confirm('確定要刪除這個資料夾嗎？')) return;
    await fetch(API.FOLDER_BY_ID(folderId), { method: 'DELETE' });
    await fetchFolders();
    if (selectedFolder === folderId) setSelectedFolder(null);
  };

  const startEditing = (folder: FolderType, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(folder.folderID);
    setEditName(folder.folderName);
  };

  const saveEdit = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editName.trim()) return;
    await fetch(API.FOLDER_BY_ID(folderId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    });
    await fetchFolders();
    setEditingFolder(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles: SelectedFileType[] = Array.from(event.target.files).map(file => ({
      file,
      name: file.name,
      size: file.size,
    }));
    setSelectedFiles(newFiles);
    setShowUploadModal(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length || !selectedFolder) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('folder_id', selectedFolder);
      selectedFiles.forEach(fileObj => formData.append('docxfiles', fileObj.file));

      const response = await fetch(API.FILES, { method: 'POST', body: formData });

      if (response.ok) {
        await fetchFolders();
        setSelectedFiles([]);
        setShowUploadModal(false);
      } else {
        alert(`上傳失敗：${response.statusText}`);
      }
    } catch (error) {
      console.error("上傳失敗：", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
    const folder = folders.find(f => f.folderID === folderId);
    setFolderFiles(folder?.files || []);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">SAP檔案管理</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 資料夾區塊 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">資料夾管理</h2>
              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                <FolderPlus className="h-4 w-4" />
                新增
              </button>
            </div>

            <div className="border-t my-2"></div>

            {folders.length === 0 ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">尚無資料夾</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {folders.map((folder) => (
                  <li key={folder.folderID}>
                    <div
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedFolder === folder.folderID ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectFolder(folder.folderID)}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-blue-600" />
                        {editingFolder === folder.folderID ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 border rounded w-full max-w-[120px]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate">{folder.folderName}</span>
                        )}
                      </div>

                      <div className="flex gap-1">
                        {editingFolder === folder.folderID ? (
                          <>
                            <button className="p-1 text-green-600 hover:bg-green-50 rounded" onClick={(e) => saveEdit(folder.folderID, e)}>
                              <Check className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded" onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolder(null);
                            }}>
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded" onClick={(e) => startEditing(folder, e)}>
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded" onClick={(e) => {
                              e.stopPropagation();
                              deleteFolder(folder.folderID);
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 檔案區塊 */}
          <div className="bg-white rounded-lg shadow p-4 md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedFolder ? `${folders.find(f => f.folderID === selectedFolder)?.folderName || ''} 中的檔案` : "請選擇資料夾"}
              </h2>

              <label>
                <input type="file" multiple className="hidden" onChange={handleFileSelect} disabled={!selectedFolder || isUploading} accept=".docx" />
                <button disabled={!selectedFolder || isUploading} className={`px-3 py-2 rounded-md flex items-center gap-1 ${!selectedFolder ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  <Upload className="h-4 w-4" />
                  上傳檔案
                </button>
              </label>
            </div>

            <div className="border-t my-2"></div>

            {!selectedFolder ? (
              <div className="flex justify-center items-center py-16">
                <p className="text-gray-500">請先選擇左側的資料夾</p>
              </div>
            ) : folderFiles.length === 0 ? (
              <div className="flex justify-center py-16">
                <p className="text-gray-500">此資料夾中沒有檔案</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {folderFiles.map((file) => (
                  <div key={file.fileID} className="border rounded-lg overflow-hidden">
                    <div className="p-3">
                      <p className="font-medium truncate" title={file.fileName}>{file.fileName}</p>
                      <p className="text-xs text-gray-500">{formatDate(file.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showUploadModal && (
              <UploadConfirmModal
                selectedFiles={selectedFiles}
                totalSize={selectedFiles.reduce((sum, file) => sum + file.size, 0)}
                onUpload={handleFileUpload}
                onClose={() => { setSelectedFiles([]); setShowUploadModal(false); }}
                onRemove={(fileName) => setSelectedFiles(selectedFiles.filter(file => file.name !== fileName))}
              />
            )}

            {showCreateFolderModal && (
              <CreateFolderModal
                newFolderName={newFolderName}
                onChangeName={setNewFolderName}
                onCreate={async () => {
                  await createFolder();
                  setShowCreateFolderModal(false);
                }}
                onClose={() => {
                  setNewFolderName('');
                  setShowCreateFolderModal(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
