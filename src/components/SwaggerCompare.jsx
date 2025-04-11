import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const SwaggerCompare = ({ originYaml, editedYaml }) => {
  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* 左邊 原始內容 */}
      <div className="w-1/2 flex flex-col border-r bg-gray-50">
        <div className="bg-gray-200 text-gray-700 font-bold text-center py-2">
          原始內容
        </div>
        <div className="flex-1 overflow-auto p-4">
          <SwaggerUI spec={originYaml} />
        </div>
      </div>

      {/* 右邊 修改後內容 */}
      <div className="w-1/2 flex flex-col bg-gray-50">
        <div className="bg-gray-200 text-red-800 font-bold text-center py-2">
          修改後內容
        </div>
        <div className="flex-1 overflow-auto p-4">
          {editedYaml ? (
            <SwaggerUI spec={editedYaml} />
          ) : (
            <div className="text-center text-gray-400 text-lg mt-20">
              尚未編輯
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SwaggerCompare
