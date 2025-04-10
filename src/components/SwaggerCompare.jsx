import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const SwaggerCompare = ({ originYaml, editedYaml }) => {
  return (
    <div className="flex w-full h-full">
      {/* 左邊 原始內容 */}
      <div className="w-1/2 border-r p-4 bg-gray-50">
        <div className="bg-gray-200 text-gray-700 font-bold text-center py-2 rounded mb-4">
          原始內容
        </div>
        <SwaggerUI spec={originYaml} />
      </div>

      {/* 右邊 修改後內容 */}
      <div className="w-1/2 p-4 bg-gray-50">
        <div className="bg-gray-200 text-red-800 font-bold text-center py-2 rounded mb-4">
          修改後內容
        </div>
        {editedYaml ? (
          <SwaggerUI spec={editedYaml} />
        ) : (
          <div className="text-center text-gray-400 text-lg mt-20">尚未編輯</div>
        )}
      </div>
    </div>
  )
}

export default SwaggerCompare
