'use client'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material'
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs, { type Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CycleType, type CycleCost } from '@prisma/client'
import { api } from '~/trpc/react'

type CycleCostInputs =  {
  name: string
  startAt: Dayjs
  cost: number
  remark: string
  cycleType: CycleType
}

const dayExchange = {
  [CycleType.DAY]: 1,
  [CycleType.WEEK]: 1/7,
  [CycleType.MONTH]: 1/30,
  [CycleType.YEAR]: 1/365,
}

const weekExchange = {
  [CycleType.DAY]: 7,
  [CycleType.WEEK]: 1,
  [CycleType.MONTH]: 1/4.35,
  [CycleType.YEAR]: 1/52.18,
}

const monthExchange = {
  [CycleType.DAY]: 30,
  [CycleType.WEEK]: 4.35,
  [CycleType.MONTH]: 1,
  [CycleType.YEAR]: 1/12,
}

const yearExchange = {
  [CycleType.DAY]: 365,
  [CycleType.WEEK]: 52.18,
  [CycleType.MONTH]: 12,
  [CycleType.YEAR]: 1,
}

const CycleCostText = {
  [CycleType.DAY]: '每日',
  [CycleType.WEEK]: '每周',
  [CycleType.MONTH]: '每月',
  [CycleType.YEAR]: '每年',
}

export default function CycleCost () {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [current, setCurrent] = useState<CycleCost | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset
  } = useForm<CycleCostInputs>()

  const createCycleCost = api.cycleCost.create.useMutation()
  const updateCycleCost = api.cycleCost.update.useMutation()
  const deleteCycleCost = api.cycleCost.delete.useMutation()

  const { data, refetch } = api.cycleCost.getAll.useQuery()
  const [costDisplay, setCostDisplay] = useState<Record<CycleType, string>>()
  useEffect(() => {
    if(data) {
      setCostDisplay({
        [CycleType.DAY]: data.reduce((a, b) => a + b.cost / 100 * dayExchange[b.cycleType], 0).toFixed(0),
        [CycleType.WEEK]: data.reduce((a, b) => a + b.cost / 100 * weekExchange[b.cycleType], 0).toFixed(0),
        [CycleType.MONTH]: data.reduce((a, b) => a + b.cost / 100 * monthExchange[b.cycleType], 0).toFixed(0),
        [CycleType.YEAR]: data.reduce((a, b) => a + b.cost / 100 * yearExchange[b.cycleType], 0).toFixed(0),
      })
    }
  }, [data])

  const onSubmit: SubmitHandler<CycleCostInputs> = async (data) => {
    console.log(data)
    if(current) {
      const input = {
        ...data,
        startAt: data.startAt.toDate(),
        cost: data.cost * 100,
        id: current.id
      }
      await updateCycleCost.mutateAsync(input)
    } else {
      const input = {
        ...data,
        startAt: data.startAt.toDate(),
        cost: data.cost * 100
      }
      await createCycleCost.mutateAsync(input)
    }
    setOpenEditDialog(false)
    refetch()
  }

  const columns: GridColDef<CycleCost>[] = [
    { field: 'name', headerName: '消费项目' },
    { field: 'cycleType', headerName: '计费周期', renderCell: (params) => CycleCostText[params.row.cycleType] },
    { field: 'cost', headerName: '消费金额', renderCell: (params) => params.row.cost / 100 },
    { field: 'startAt', headerName: '开始时间', renderCell: (params) => dayjs(params.row.startAt).format('YYYY-MM-DD') },
    { field: 'remark', headerName: '备注' },
    { field: 'action', headerName: '操作', width: 200,
      renderCell: (params) => (
        <>
        <Button variant="contained" sx={{mr: 2}} onClick={async () => {
          console.log('edit', params, params.row)
          setCurrent(params.row)
          setValue('cost', params.row.cost / 100)
          setValue('cycleType', params.row.cycleType)
          setValue('name', params.row.name)
          params.row.remark && setValue('remark', params.row.remark)
          setValue('startAt', dayjs(params.row.startAt))
          setOpenEditDialog(true)
        }}>改</Button>
        <Button variant="contained" color="error" onClick={async () => {
          if(confirm(`删除 ${params.row.name} ?`)) {
            await deleteCycleCost.mutateAsync({ id: params.row.id })
            refetch()
          }
        }}>删</Button>
        </>
      )
    },
  ]

  return <>
  {/* 每日每周每月每年成本核算 */}
    <div style={{ width: '100%' }}>
      <Button variant="contained" onClick={() => {
        setCurrent(null)
        reset()
        setOpenEditDialog(true)
      }}>增</Button>
      <div>每日开销：{costDisplay?.[CycleType.DAY]}</div>
      <div>每周开销：{costDisplay?.[CycleType.WEEK]}</div>
      <div>每月开销：{costDisplay?.[CycleType.MONTH]}</div>
      <div>每年开销：{costDisplay?.[CycleType.YEAR]}</div>
      <DataGrid
        autoHeight
        rows={data || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 1, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10]}
        getRowId={value => {
          // console.log(value)
          return value.name
        }}
      />
    </div>

    <Dialog 
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      >
      <DialogTitle>{current ? '修改' : '新建'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            id="name" 
            label="名称" 
            {...register('name', { required: '你输入啊' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            ></TextField>
          <FormControl error={!!errors.cycleType}>
            <InputLabel id="cycleType">cycleType</InputLabel>
            <Controller 
              control={control}
              name="cycleType"
              defaultValue="MONTH"
              rules={{ required: '你输入啊' }}
              render={({field}) => (
                <Select
                  id="cycleType"
                  labelId="cycleType"
                  label="周期类型"
                  {...field}
                >
                  <MenuItem value={CycleType.DAY}>每日</MenuItem>
                  <MenuItem value={CycleType.WEEK}>每周</MenuItem>
                  <MenuItem value={CycleType.MONTH}>每月</MenuItem>
                  <MenuItem value={CycleType.YEAR}>每年</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.cycleType?.message}</FormHelperText>
          </FormControl>
          <TextField 
            id="cost" 
            label="花费" 
            {...register('cost', { required: '你输入啊' })}
            error={!!errors.cost}
            helperText={errors.cost?.message}
            ></TextField>
          <Controller 
            control={control}
            name="startAt"
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
          <TextField 
            id="remark" 
            label="备注" 
            {...register('remark')}
            error={!!errors.remark}
            helperText={errors.remark?.message}
            ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} variant="outlined">取消</Button>
          <Button variant="contained" type="submit">确认</Button>
        </DialogActions>
      </form>
    </Dialog>
  </>
}