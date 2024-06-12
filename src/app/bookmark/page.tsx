'use client'
import { Button, Stack, Box } from "@mui/material"
import { useRef, useState, useEffect } from "react"

export default function() {
  const inputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [file, setFile] = useState<File|null>(null)

  useEffect(() => {
    if(file) {
      console.log(file)
      const reader = new FileReader()
      reader.onload = function (event) {
        iframeRef.current?.contentDocument?.write(event.target?.result?.toString() || '')
      }
      reader.readAsText(file)
    }
   
  }, [file])

  return <Stack p={2} gap={2}>
    <Button variant="contained" onClick={() => inputRef.current?.click()}>Upload bookmark</Button>
    <input ref={inputRef} className="hidden" type="file" onChange={event => setFile(event.target.files ? event.target.files[0]! : null)} />
    <iframe ref={iframeRef} className="h-dvh"></iframe>
  </Stack>
}