// components/CreateFolderModal.tsx
import React from 'react';

interface CreateFolderModalProps {
  newFolderName: string;
  onChangeName: (value: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  newFolderName,
  onChangeName,
  onCreate,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">創建新資料夾</h2>
        <input
          type="text"
          placeholder="輸入資料夾名稱"
          value={newFolderName}
          onChange={(e) => onChangeName(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded-md">
            取消
          </button>
          <button
            onClick={onCreate}
            disabled={!newFolderName.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            創建資料夾
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
