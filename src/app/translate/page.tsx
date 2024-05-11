'use client'
import { TextArea } from "antd-mobile"
import { useState } from "react"
import { Button } from "@mui/material"
import { api } from "~/trpc/react"

export default function () {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const translateText = api.translate.translateText.useMutation({
    onSuccess(data) {
      setResult(data || '')
    }
  })
  function onTranslate() {
    if(!value) return
    translateText.mutate({text: value})
  }
  return <>
    <div className="p-4">
      <TextArea className="bg-gray-100" placeholder="输入中文" value={value} onChange={val => setValue(val)}></TextArea>
      <div className="text-center my-4">
        <Button variant="contained" onClick={onTranslate}>translate</Button>
      </div>
      <p>翻译结果</p>
      <p>{result}</p>
    </div>

  </>
}