'use client'
import { useRef, useState } from "react"
import { api } from "~/trpc/react"
import axios from "axios"
import Image from "next/image"
import Checkbox from '@mui/material/Checkbox'
import { Button } from "@mui/material"

export default function Upload() {
  const [file, setFile] = useState<File|null>(null)
  const { data: files, refetch } = api.file.getOwnFiles.useQuery()
  const [imageIds, setImageIds] = useState<number[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const submitFile = async () => {
    if(!file) {
      alert('未选择任何文件')
      return
    }
    const formData = new FormData()
    formData.append('key', file.name)
    formData.append('file', file)
    console.log(file)

    await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
      console.log(response)
    }).catch(error => {
      console.error(error)
    })
    setFile(null)
    await refetch()
    alert('上传成功')
  }

  const removeFiles = api.file.removeFiles.useMutation({
    onSuccess() {
      console.log('mutate success')
      refetch()
    }
  })

  async function onRemove() {
    if(!imageIds.length) {
      alert('未选择图片')
      return
    }
    await removeFiles.mutate({fileIds: imageIds})
    alert('删除成功')
    setImageIds([])
  }

  async function downloadResource(url: string, filename: string) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const blob = await response.blob()
    const downloadLink = document.createElement('a')
    downloadLink.href = window.URL.createObjectURL(blob)
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  function onDownload() {
    if(!imageIds.length) {
      alert('未选择文件')
      return
    }
    const id = imageIds[0]
    const file = files?.find(item => item.id === id)
    downloadResource(file?.url || '', file?.name || '')
  }

  return (<>
    <h1 className="text-center text-2xl font-bold">upload your own Images</h1>
    <div className="text-center">
      <p>{file?.name || '未选择任何文件'}</p>
      <Button variant="contained" onClick={() => inputRef.current?.click()}>select file</Button>
      <input ref={inputRef} className="hidden" type="file" onChange={event => setFile(event.target.files ? event.target.files[0]! : null)} />
    </div>
    <div className="text-center mt-4">
      <Button variant="contained" onClick={submitFile}>Upload</Button>
    </div>

    <h2 className="text-center text-xl font-bold">your Images</h2>
    <div className="flex gap-1 flex-wrap">
      {files?.map(item => 
        <div key={item.hash} className="relative border border-gray-200 border-solid">
          <Checkbox className="absolute top-0 left-0" value={item.id} checked={imageIds.includes(item.id)} onChange={(e, checked) => {
            console.log(checked, e)
            checked ? setImageIds(imageIds.concat([Number(e.target.value)])) : setImageIds(imageIds.filter(item => item !== Number(e.target.value)))
          }}/>
          <Image alt="image" src={item.url || ''} width={100} height={100}/>
        </div>
      )}
    </div>
    <div className="text-center mt-4">
      <Button variant="contained" onClick={onDownload}>下载文件</Button>
      <Button variant="contained" color="error" onClick={onRemove}>选择并删除图片</Button>
    </div>
  </>)
}
