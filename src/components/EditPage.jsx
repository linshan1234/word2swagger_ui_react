import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import SwaggerCompare from "./SwaggerCompare"
import ChatBox from "./ChatBox"

const EditPage = () => {
  const { fileId } = useParams()
  const [originYaml, setOriginYaml] = useState(null) // 左邊 Swagger
  const [editedYaml, setEditedYaml] = useState(null) // 右邊 Swagger
  const [chatHistory, setChatHistory] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Step 1. 頁面載入時 fetch 原始 YAML
  const fetchYaml = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:6678/api/record/${fileId}`)
      if (!response.ok) throw new Error("無法獲取檔案")
      const data = await response.json()
      if (!data.yaml) throw new Error("找不到 YAML 內容")
      setOriginYaml(data.yaml)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchYaml()
  }, [fileId])

  // Step 2. 使用者輸入對話 -> call POST /api/edit -> 更新右邊 Swagger
  const handleSendMessage = async (message) => {
    setChatHistory((prev) => [...prev, { role: "user", content: message }])
  
    try {
      const response = await fetch(`http://127.0.0.1:6678/api/record/${fileId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_msg: message }),  // 正確 key
      })
  
      if (response.status !=200) throw new Error("編輯失敗")
  
      const data = await response.json()
  
      setEditedYaml(data.yaml)
      setChatHistory((prev) => [
        ...prev,
        {
          role: "system",
          content: "已為您修改完成，請預覽是否更改正確，是請按確認修改，或是點擊取消為您重新生成更改方法。",
        },
      ])
    } catch (err) {
      console.error(err)
      alert("修改過程發生錯誤")
    }
  }

  // Step 3. 確認修改: call PUT /api/record/{fileId}
  const handleConfirm = async () => {
    try {
      await fetch(`http://127.0.0.1:6678/api/record/${fileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yaml: editedYaml }),
      })
      alert("已成功更新！")
    } catch (err) {
      console.error(err)
      alert("更新失敗")
    }
  }

  // Step 4. 取消: 清空右邊 + 清空對話紀錄
  const handleCancel = () => {
    setEditedYaml(null)
    setChatHistory([])
  }

  if (loading) return <div className="p-8 text-gray-500">加載中...</div>
  if (error) return <div className="p-8 text-red-500">❌ {error}</div>

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <SwaggerCompare originYaml={originYaml} editedYaml={editedYaml} />
      </div>
      <ChatBox
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default EditPage
