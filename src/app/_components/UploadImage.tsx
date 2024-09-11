import { Button, Box } from "@mui/material"
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useRef, useState } from "react"
import axios from "axios"

export default function UploadImage({ url, onUploaded }: {
  url: string,
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return <>
    <Box sx={{width: '100%', minHeight: '200px', border: '1px dashed #888'}}>
      <img src={url} style={{'width': '100%'}}/>
    </Box>
    <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => inputRef.current?.click()}>上传图片</Button>
    <input ref={inputRef} className="hidden" type="file" onChange={async (event) => {
      const file = event?.target?.files?.[0]
      console.log('file is ', file)
      if(!file) return
      if(!file?.type.startsWith('image')) {
        alert('上传的不是图片')
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      formData.append('originName', file.name)
      formData.append('mimeType', file.type)
      formData.append('saveType', '2')

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      onUploaded(res.data.url)
      if(res.data.error) {
        alert('upload fail')
      } else {
        alert('upload success')
      }
    }} />
  </>
}