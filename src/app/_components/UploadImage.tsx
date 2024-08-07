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
    <Box sx={{width: '100%', height: '200px', border: '1px dashed #888'}}>
      <img src={url} style={{'objectFit': 'contain'}}/>
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
      formData.append('key', file.name)
      formData.append('file', file)
      formData.append('type', file.type)
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