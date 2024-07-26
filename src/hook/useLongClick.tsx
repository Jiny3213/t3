import { useState } from "react";

export default function useLongClick({
  onClick,
  onLongClick,
  timeout = 500
}: {
  onClick: Function,
  onLongClick: Function,
  timeout?: number
}) {
  const [isLong, setIsLong] = useState(false)
  const [startTime, setStartTime] = useState(0)

  return {
    onClick: () => {
      if(!isLong) {
        onClick()
      }
    },
    onTouchStart: () => {
      setStartTime(new Date().getTime())
      setIsLong(false)
    },
    onTouchEnd: () => {
      const endTime = new Date().getTime()
      setIsLong(endTime - startTime > timeout)
      if(endTime - startTime > timeout) {
        onLongClick()
      }
    },
    onMouseDown: () => {
      setStartTime(new Date().getTime())
      setIsLong(false)
    },
    onMouseUpCapture: () => {
      const endTime = new Date().getTime()
      setIsLong(endTime - startTime > timeout)
      if(endTime - startTime > timeout) {
        onLongClick()
      }
    }
  }
}