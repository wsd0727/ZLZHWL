import { download } from '@/utils/request'

// 文件下载接口（权限验证）
export function downFile(data) {
  return download("/sys/file/download-safe-file", data)
}