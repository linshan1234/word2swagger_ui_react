import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const PreviewPage = () => {
  const { fileId } = useParams()
  const [yamlContent, setYamlContent] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchYaml = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:6678/api/record/${fileId}`)
        if (!response.ok) throw new Error("無法獲取檔案")

        const data = await response.json()
        if (!data.yaml) throw new Error("找不到 YAML 內容")

        setYamlContent(data.yaml)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchYaml()
  }, [fileId])

  if (loading) return <div className="p-8 text-gray-500">加載中...</div>
  if (error) return <div className="p-8 text-red-500">❌ {error}</div>

  return (
    <div className="p-6">
      <SwaggerUI spec={yamlContent} />
    </div>
  )
}

export default PreviewPage