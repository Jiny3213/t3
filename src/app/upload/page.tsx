'use client'
import { useRef, useState } from "react"
import * as React from 'react';
import { api } from "~/trpc/react"
import axios from "axios"
import Image from "next/image"
import Checkbox from '@mui/material/Checkbox'
import { Button } from "@mui/material"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Upload() {
  const [file, setFile] = useState<File|null>(null);
  const { data: files, refetch } = api.file.getOwnFiles.useQuery()
  const [open, setOpen] = React.useState(false);
  const [imageIds, setImageIds] = useState<number[]>([])

  console.log(files)

  const submitFile = async () => {
    if(!file) {
      setOpen(true)
      return
    }
    const formData = new FormData();
    formData.append('key', file.name)
    formData.append('file', file)
    console.log(file)

    await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });

    await refetch()
  };

  const removeFiles = api.file.removeFiles.useMutation({
    onSuccess() {
      console.log('mutate success')
      refetch()
    }
  })

  async function onRemove() {
    console.log(imageIds)
    await removeFiles.mutate({fileIds: imageIds})
    setImageIds([])
  }

  return (<>
    <h1 className="text-center text-2xl font-bold">upload your own Images</h1>
    <input type="file" onChange={event => setFile(event.target.files ? event.target.files[0]! : null)} />
    <Button variant="contained" onClick={submitFile}>Upload</Button>

    <h2 className="text-center text-xl font-bold">your Images</h2>
    <div className="flex gap-1">
      {files?.map(item => 
        <div key={item.hash} className="relative border">
          <Checkbox className="absolute top-0 left-0" value={item.id} checked={imageIds.includes(item.id)} onChange={(e, checked) => {
            console.log(checked, e)
            checked ? setImageIds(imageIds.concat([Number(e.target.value)])) : setImageIds(imageIds.filter(item => item !== Number(e.target.value)))
          }}/>
          <Image alt="image" src={item.url || ''} width={100} height={100}/>
        </div>
      )}
    </div>
    <Button variant="contained" color="error" onClick={onRemove}>删除图片</Button>
    

    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"还未选择图片?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          选择图片再上传
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>确认</Button>
        <Button onClick={() => setOpen(false)} autoFocus>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  </>)
}
