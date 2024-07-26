"use client"
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { Chip, Badge, Box, Stack, ImageList, ImageListItem, ImageListItemBar, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import { useState } from 'react'
import useLongClick from '~/hook/useLongClick'
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs'
import UploadImage from '../_components/UploadImage'

type CateInputs = {
  name: string
}

type ClothesInputs = {
  name: string
  buyTime: Dayjs
  cost: number
  location: string
  images: string
}

export default function() {
  const [activeCate, setActiveCate] = useState(0)
  const [openCate, setOpenCate] = useState(false)
  const [openClothes, setOpenClothes] = useState(false)
  const [currentCate, setCurrentCate] = useState<any>(null)
  const [currentClothes, setCurrentClothes] = useState<any>(null)

  const {
    register: cateRegister,
    handleSubmit: handleSubmitCate,
    formState: { errors: cateErrors },
    setValue: setCateValue
  } = useForm<CateInputs>()

  const {
    register: clothesRegister,
    handleSubmit: handleSubmitClothes,
    formState: { errors: clothesErrors },
    setValue: setClothesValue,
    control: clothesControl
  } = useForm<ClothesInputs>()

  const onSubmitCate: SubmitHandler<CateInputs> = (data) => {
    console.log(data)
  }

  const onSubmitClothes: SubmitHandler<ClothesInputs> = (data) => {
    console.log(data)
  }

  const cate = [
    {
      name: '默认',
    },
    {
      name: '短衫',
    },
    {
      name: '短裤',
    },
    {
      name: '长衫',
    },
    {
      name: '长裤',
    },
    {
      name: '鞋子',
    },
    {
      name: '袜子',
    },
    {
      id: 333,
      name: '衬衫',
    },
  ]
  const clothesList = [
    {
      name: '特看短袖',
      buyTime: '2024/04/16',
      cost: 0,
      location: '衣柜'
    },
    {
      name: '淘工厂短裤',
      buyTime: '2024/07/16',
      cost: 2000,
      location: '衣柜'
    },
    {
      name: '亚瑟士蓝色运动鞋',
      buyTime: '2016/04/16',
      cost: 29900,
      location: '鞋柜'
    },
  ]
  return <>
    <Box sx={{ p:2 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        { cate.map((item, index) => (
          <Badge key={item.name} badgeContent={4} color="primary">
            <Chip 
              label={item.name} 
              {...activeCate === index && {color: 'primary'}}
              {...useLongClick({
                onClick: () => setActiveCate(index),
                onLongClick: () => {
                  setCurrentCate(item)
                  setCateValue('name', item.name)
                  setOpenCate(true)
                }
              })}
              />
          </Badge>
        )) }
        <Chip 
          icon={<AddIcon />}
          label="添加分类"
          onClick={() => {
            setCurrentCate(null)
            setCateValue('name', '')
            setOpenCate(true)
          }}
          />
      </Stack>
      <ImageList sx={{ width: '100%' }} gap={8}>
        { clothesList.map(item => (
          <ImageListItem key={item.name} onClick={() => {
            setCurrentClothes(item)
            setOpenClothes(true)
            setClothesValue('name', item.name)
            setClothesValue('buyTime', dayjs(item.buyTime))
            setClothesValue('location', item.location)
            setClothesValue('cost', item.cost)
          }}>
            <img src="/images/default.png" alt="clothes" loading="lazy"/>
            <ImageListItemBar 
              title={item.name}
              subtitle={item.buyTime}
              />
          </ImageListItem>
        )) }
      </ImageList>

      {/* 衣服弹窗 */}
      <Dialog 
        open={openClothes}
        onClose={() => setOpenClothes(false)}
        >
        <DialogTitle>{currentClothes ? currentClothes.name : '新增衣服'}</DialogTitle>
        <form onSubmit={handleSubmitClothes(onSubmitClothes)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              id="name" 
              label="名称" 
              {...clothesRegister('name', { required: '你输入啊' })}
              error={!!clothesErrors.name}
              helperText={clothesErrors.name?.message}
              ></TextField>
            <TextField 
              id="cost" 
              label="花费" 
              type="number"
              {...clothesRegister('cost', { required: '你输入啊' })}
              error={!!clothesErrors.cost}
              helperText={clothesErrors.cost?.message}
              ></TextField>
            <TextField 
              id="location" 
              label="存放位置" 
              {...clothesRegister('location', { required: '你输入啊' })}
              error={!!clothesErrors.location}
              helperText={clothesErrors.location?.message}
              ></TextField>
            {/* https://github.com/orgs/react-hook-form/discussions/10135 */}
            <Controller 
              control={clothesControl}
              name="buyTime"
              defaultValue={dayjs()}
              rules={{ required: '你输入啊' }}
              render={({field}) => {
                return (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                      label="Basic date picker" 
                      format="YYYY-MM-DD"
                      value={field.value}
                      inputRef={field.ref}
                      onChange={date => {
                        console.log(date)
                        field.onChange(date)
                      }}
                      />
                  </LocalizationProvider>
                )
              }}
              />
            <Controller 
              control={clothesControl}
              name="images"
              defaultValue={''}
              rules={{ required: '你输入啊' }}
              render={({field}) => {
                return (
                  <UploadImage url={field.value} onUploaded={url => {
                    console.log('onUploaded', url)
                    field.onChange(url)
                  }}></UploadImage>
                )
              }}
              />
            {/* <TextField 
              id="images" 
              label="图片" 
              {...clothesRegister('images', { required: '你输入啊' })}
              error={!!clothesErrors.images}
              helperText={clothesErrors.images?.message}
              ></TextField> */}
            {/* <img src="/images/default.png" alt="clothes" loading="lazy"/> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenClothes(false)} variant="outlined">修改</Button>
            <Button variant="contained" type="submit">确认</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* 分类弹窗 */}
      <Dialog 
        open={openCate}
        onClose={() => setOpenCate(false)}
        >
        <DialogTitle>{currentCate ? '修改分类' : '新建分类'}</DialogTitle>
        <form onSubmit={handleSubmitCate(onSubmitCate)}>
          <DialogContent >
            <TextField 
              id="name" 
              label="分类名称" 
              {...cateRegister('name', { required: '你输入啊' })}
              error={!!cateErrors.name}
              helperText={cateErrors.name?.message}
              ></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCate(false)} variant="outlined">取消</Button>
            <Button variant="contained" type="submit">确认</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Fab color="primary" aria-label="add" sx={{bottom: 16, right: 16, position: 'fixed'}} onClick={() => {
        setCurrentClothes(null)
        setOpenClothes(true)
      }}>
        <AddIcon />
      </Fab>
    </Box>
  </>
}