import React, { useState } from "react"

const ChatBox = ({ chatHistory, onSendMessage, onConfirm, onCancel }) => {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim() === "") return
    onSendMessage(input)
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
    }
  }

  return (
    <div className="border-t p-4">
      {/* 對話紀錄 */}
      <div className="h-40 overflow-y-auto space-y-2 mb-2">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[70%] px-3 py-2 rounded-lg text-sm break-words
                ${msg.role === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-800"}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 輸入框 */}
      <textarea
        className="border p-2 w-full h-24 resize-none"
        placeholder="請輸入要修改的內容...(Shift + Enter換行)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* 按鈕區 */}
      <div className="flex justify-between mt-2">
        {/* 左邊 送出 */}
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          送出
        </button>

        {/* 右邊 確認修改 / 取消 */}
        <div className="flex space-x-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            確認修改
          </button>
          <button
            onClick={onCancel}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
