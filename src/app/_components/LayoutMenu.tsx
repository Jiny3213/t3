'use client'
import { IconButton, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from "react"
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { usePathname } from "next/navigation"

import HomeIcon from '@mui/icons-material/Home'

import TranslateIcon from '@mui/icons-material/Translate'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen'
import HikingIcon from '@mui/icons-material/Hiking'

import dayjs from "dayjs"

export default function() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const menuList = [
    {
      label: 'Translate',
      href: '/translate',
      icon: <TranslateIcon />
    },
    {
      label: 'Upload',
      href: '/upload',
      icon: <CloudUploadIcon />
    },
    {
      label: 'Clothes',
      href: '/clothes',
      icon: <CheckroomIcon />
    },
    {
      label: 'Cycle cost',
      href: '/cycleCost',
      icon: <CurrencyYenIcon />
    },
    {
      label: 'Travel',
      href: '/travel',
      icon: <HikingIcon />
    }
  ]

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setIsOpen(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton href="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="home" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {menuList.map((item, index) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton href={item.href} onClick={e => {
              console.log('click', e)
              window.gtag('event', 'menu.click', {
                date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                menu: item.label
              })
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={() => setIsOpen(true)}
    >
      <MenuIcon />
    </IconButton>
    <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
      {DrawerList}
    </Drawer>
    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
      {menuList.find(item => item.href === pathname)?.label || 'Create t3 app'}
    </Typography>
    </>
  )
}