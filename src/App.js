import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import FileUploadUI from "./components/FileUploadUI"
import PreviewPage from "./components/PreviewPage"
import EditPage from "./components/EditPage"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 首頁上傳與檔案列表 */}
        <Route path="/" element={<FileUploadUI />} />
        {/* 預覽頁面 */}
        <Route path="/preview/:fileId" element={<PreviewPage />} />
        {/* 編輯swagger */}
        <Route path="/edit/:fileId" element={<EditPage />} />
      </Routes>
    </Router>
  )
}

export default App