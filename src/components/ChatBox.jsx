import React, { useState } from "react"

const ChatBox = ({ chatHistory, onSendMessage, onConfirm, onCancel }) => {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim() === "") return
    onSendMessage(input)
    setInput("")
  }

  return (
    <div className="bg-white shadow-xl border border-dashed border-gray-400 p-4 m-4 rounded-lg flex flex-col h-[250px]">
      <div className="font-semibold text-gray-700 mb-2 border-b pb-2">AI輔助修改</div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`text-sm px-3 py-2 rounded-2xl max-w-[70%] break-words
              ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start border-t pt-2">
        <textarea
          className="flex-1 border p-2 rounded-md h-20 resize-none"
          placeholder="請描述您想要的修改..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault() // 禁止 Enter 直接送出
            }
          }}
        />

        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          發送
        </button>

        <div className="ml-4 space-x-2">
          <button onClick={onConfirm} className="bg-green-500 text-white px-3 py-2 rounded">
            確認
          </button>
          <button onClick={onCancel} className="bg-red-500 text-white px-3 py-2 rounded">
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
