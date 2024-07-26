'use client'
import { useEffect, useRef, useState } from "react"
import { api } from "~/trpc/react"
import axios from "axios"
import { Button, CircularProgress, Box, List, ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Typography, Link, ListItemButton } from "@mui/material"
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import { type File as FileModel } from "@prisma/client"
import UploadImage from "../_components/UploadImage"

export default function Upload() {
  const [file, setFile] = useState<File|null>(null)
  const { data: files, refetch } = api.file.getOwnFiles.useQuery()
  const inputRef = useRef<HTMLInputElement>(null)

  const submitFile = async () => {
    if(!file) {
      alert('未选择任何文件')
      return
    }
    const formData = new FormData()
    formData.append('key', file.name)
    formData.append('file', file)
    formData.append('type', file.type)
    console.log(file)

    const res = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    if(res.data.error) {
      alert('upload fail')
    } else {
      setFile(null)
      await refetch()
      alert('upload success')
    }
  }

  const removeFiles = api.file.removeFiles.useMutation({
    onSuccess() {
      console.log('mutate success')
      refetch()
    }
  })

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

  async function onDelete(file: FileModel) {
    const confirm = window.confirm(`delete ${file.originName} ?`)
    if(confirm) {
      await removeFiles.mutate({fileIds: [file.id]})
    }
  }

  async function onDownload(file: FileModel) {
    downloadResource(file.url, file.originName)
  }

  useEffect(() => {
    console.log(file)
  }, [file])

  return (<>
    <h1 className="text-center text-2xl font-bold">Upload your Files:</h1>
    <div className="text-center">
      {/* <UploadImage></UploadImage> */}
      <p>{file?.name || '未选择任何文件'}</p>
      <Button variant="contained" onClick={() => inputRef.current?.click()}>select file</Button>
      <input ref={inputRef} className="hidden" type="file" onChange={event => setFile(event.target.files ? event.target.files[0]! : null)} />
    </div>
    <div className="text-center mt-4">
      <Button variant="contained" onClick={submitFile}>Upload</Button>
    </div>

    <h2 className="text-center text-xl font-bold">Your Files:</h2>
    {!files && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
    <List>
      {files?.map(item => 
        <ListItem key={item.hash} secondaryAction={
          <>
          <IconButton onClick={() => onDownload(item)}>
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(item)}>
            <DeleteIcon />
          </IconButton>
          </>
        }>
          <ListItemAvatar>
            {item.type.startsWith('image/') ? <Avatar src={item.url}></Avatar> :<Avatar><FolderIcon /></Avatar>}
          </ListItemAvatar>
          <ListItemText>
            <Link href={item.url} underline="hover" target="_blank">{item.originName || item.name}</Link>
          </ListItemText>
        </ListItem>
      )}
    </List>
  </>)
}
