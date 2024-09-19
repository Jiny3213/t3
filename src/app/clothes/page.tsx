"use client"
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { Chip, Badge, Box, Stack, ImageList, ImageListItem, ImageListItemBar, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs'
import UploadImage from '../_components/UploadImage'
import { api } from '~/trpc/react'
import { CND_PATH } from '~/config'

type CateInputs = {
  name: string
}

type ClothesInputs = {
  name: string
  buyAt: Dayjs | undefined
  cost: number | undefined
  location: string
  cover: string
  categoryId: number
}

export default function() {
  const [activeCate, setActiveCate] = useState(0)
  const [openCate, setOpenCate] = useState(false)
  const [openClothes, setOpenClothes] = useState(false)
  const [currentCate, setCurrentCate] = useState<any>(null)
  const [currentClothes, setCurrentClothes] = useState<any>(null)

  const { data: categoryList = [], refetch: refetchCategory } = api.clothes.getCategory.useQuery()
  const defaultCategory = {
    id: 0,
    pid: 0,
    name: '默认',
  }
  const { data: clothesList = [], refetch: refetchClothes } = api.clothes.getClothes.useQuery({
    categoryId: categoryList[activeCate - 1]?.id
  })
  const createCategory = api.clothes.createCategory.useMutation()
  const updateCategory = api.clothes.updateCategory.useMutation()
  const createClothes = api.clothes.createClothes.useMutation()
  const updateClothes = api.clothes.updateClothes.useMutation()

  const {
    register: cateRegister,
    handleSubmit: handleSubmitCate,
    formState: { errors: cateErrors },
    setValue: setCateValue,
    reset: resetCate
  } = useForm<CateInputs>()

  const {
    register: clothesRegister,
    handleSubmit: handleSubmitClothes,
    formState: { errors: clothesErrors },
    setValue: setClothesValue,
    control: clothesControl,
    reset: resetClothes,
  } = useForm<ClothesInputs>()

  const onSubmitCate: SubmitHandler<CateInputs> = async (data) => {
    console.log(data)
    if(currentCate?.id) {
      await updateCategory.mutateAsync({
        ...data,
        id: currentCate.id
      })
    } else {
      await createCategory.mutateAsync(data)
    }
    setOpenCate(false)
    refetchCategory()
  }

  const onSubmitClothes: SubmitHandler<ClothesInputs> = async (data) => {
    console.log(data)
    const postData = {
      ...data,
      buyAt: data.buyAt ? data.buyAt.toDate() : data.buyAt,
      cost: data.cost ? data.cost * 100 : undefined // zod的optional表示undefined，不能是null
    }
    if(currentClothes?.id) {
      await updateClothes.mutateAsync({
        ...postData,
        id: currentClothes.id
      })
    } else {
      await createClothes.mutateAsync(postData)
    }
    setOpenClothes(false)
    refetchClothes()
  }
 
  return <>
    <Box sx={{ p:2 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        { [defaultCategory, ...categoryList].map((item, index) => (
          <Badge key={item.name} badgeContent={4} color="primary">
            <Chip 
              label={item.name} 
              {...activeCate === index && {
                color: 'primary',
                ...item.id !== 0 && {
                  onDelete: () => {
                    setCurrentCate(item)
                    setCateValue('name', item.name)
                    setOpenCate(true)
                  },
                  deleteIcon: <EditIcon />
                }
              }}
              onClick={() => {
                setCurrentCate(null)
                setActiveCate(index)
              }}
              />
          </Badge>
        )) }
        <Chip 
          icon={<AddIcon />}
          label="添加分类"
          onClick={() => {
            resetCate()
            setCurrentCate(null)
            setOpenCate(true)
          }}
          />
      </Stack>

      <ImageList sx={{ width: '100%' }} gap={8}>
        { clothesList.map(item => (
          <ImageListItem key={item.name} onClick={() => {
            console.log(item)
            setCurrentClothes(item)
            setOpenClothes(true)
            setClothesValue('name', item.name)
            setClothesValue('buyAt', item.buyAt ? dayjs(item.buyAt) : undefined)
            setClothesValue('location', item.location || '')
            setClothesValue('cost', item.cost ? item.cost / 100 : undefined)
            setClothesValue('cover', item.cover || '')
          }}>
            <img src={item.cover ? '/static/' + item.cover : "/images/default_image.png"} alt="clothes" loading="lazy"/>
            <ImageListItemBar 
              title={item.name}
              subtitle={item.buyAt ? dayjs(item.buyAt).format('YYYY-MM-DD') : '-'}
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
              {...clothesRegister('name', { required: '请输入名称' })}
              error={!!clothesErrors.name}
              helperText={clothesErrors.name?.message}
              ></TextField>
            <TextField 
              id="cost" 
              label="花费(元)" 
              type="number"
              {...clothesRegister('cost', { valueAsNumber: true })}
              error={!!clothesErrors.cost}
              helperText={clothesErrors.cost?.message}
              ></TextField>
            <TextField 
              id="location" 
              label="存放位置" 
              {...clothesRegister('location')}
              error={!!clothesErrors.location}
              helperText={clothesErrors.location?.message}
              ></TextField>
            <TextField
              id="categoryId"
              {...clothesRegister('categoryId', { valueAsNumber: true })}
              defaultValue={0}
              select
              label="分类"
              >
                {[defaultCategory, ...categoryList].map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
            </TextField>
            {/* https://github.com/orgs/react-hook-form/discussions/10135 */}
            <Controller 
              control={clothesControl}
              name="buyAt"
              // defaultValue={dayjs()}
              // rules={{ required: '你输入啊' }}
              render={({field}) => {
                return (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                      label="买入时间"
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
              name="cover"
              defaultValue={''}
              // rules={{ required: '你输入啊' }}
              render={({field}) => {
                return (
                  <UploadImage url={field.value ? '/static/' + field.value : "/images/default_image.png"} onUploaded={data => {
                    console.log('onUploaded', data)
                    if(data.key) {
                      field.onChange(data.key)
                    }
                  }}></UploadImage>
                )
              }}
              />
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
              {...cateRegister('name', { required: '请输入分类名称' })}
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
        resetClothes()
        setCurrentClothes(null)
        setOpenClothes(true)
      }}>
        <AddIcon />
      </Fab>
    </Box>
  </>
}