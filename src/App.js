import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import FileUploadUI from "./components/FileUploadUI"
import PreviewPage from "./components/PreviewPage"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 首頁上傳與檔案列表 */}
        <Route path="/" element={<FileUploadUI />} />
        {/* 預覽頁面 */}
        <Route path="/preview/:fileId" element={<PreviewPage />} />
      </Routes>
    </Router>
  )
}

export default App