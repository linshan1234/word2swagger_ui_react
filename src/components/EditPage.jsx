import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import SwaggerCompare from "./SwaggerCompare"
import ChatBox from "./ChatBox"

const EditPage = () => {
  const { fileId } = useParams()
  const [originYaml, setOriginYaml] = useState(null)
  const [editedYaml, setEditedYaml] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchYaml = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:6678/api/record/${fileId}`)
        if (!res.ok) throw new Error("無法獲取檔案")
        const data = await res.json()
        if (!data.yaml) throw new Error("找不到 YAML 內容")
        setOriginYaml(data.yaml)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchYaml()
  }, [fileId])

  const handleSendMessage = async (message) => {
    setChatHistory((prev) => [...prev, { role: "user", content: message }])
    try {
      const res = await fetch(`http://127.0.0.1:6678/api/record/${fileId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_msg: message }),
      })
      if (res.status !== 200) throw new Error("編輯失敗")
      const data = await res.json()
      setEditedYaml(data.yaml)
      setChatHistory((prev) => [
        ...prev,
        { role: "system", content: "已為您修改完成，請預覽右方更改結果，更改正確請按『確認修改』，需要調整請按『取消』，重新生成更改內容。" },
      ])
    } catch (err) {
      console.error(err)
      alert("修改過程發生錯誤")
    }
  }

  const handleConfirm = async () => {
    await fetch(`http://127.0.0.1:6678/api/record/${fileId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yaml: editedYaml }),
    })
    alert("已成功更新！")
  }

  const handleCancel = () => {
    setEditedYaml(null)
    setChatHistory([])
  }

  if (loading) return <div className="p-8 text-gray-500">加載中...</div>
  if (error) return <div className="p-8 text-red-500">❌ {error}</div>

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-lg font-medium">Swagger 文件編輯器</h1>
        <span>檔案名稱: FS_SD002_客戶料號主檔_Inbound_20230821_V3</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
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
