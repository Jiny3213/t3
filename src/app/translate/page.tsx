'use client'
import { TextArea } from "antd-mobile"
import { useState } from "react"
import { Button } from "@mui/material"
import { api } from "~/trpc/react"

export default function () {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')

  const translateText = api.translate.translateText.useMutation()
  const { data: translationCount, refetch } = api.translate.translationCount.useQuery()

  async function onTranslate() {
    if(!value) return
    const res = await translateText.mutateAsync({
      text: value,
      source: 'zh',
      target: 'en'
    })
    setResult(res)
    refetch()
  }

  return <>
    <div className="p-4">
      <TextArea onEnterPress={e => {
        console.log(e)
        if(!e.shiftKey) {
          e.preventDefault()
          onTranslate()
        }
      }} className="bg-gray-100" placeholder="输入中文" value={value} onChange={val => setValue(val)}></TextArea>
      <div className="text-center my-4">
        <Button variant="contained" onClick={onTranslate}>translate</Button>
      </div>
      <p>已使用翻译额度</p>
      <p>{translationCount || 0}/5000000</p>
      <p>翻译结果</p>
      <p>{result}</p>
    </div>
  </>
}