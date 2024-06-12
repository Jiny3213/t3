'use client'
import { IconButton } from "@mui/material"
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
import HomeIcon from '@mui/icons-material/Home'
import TranslateIcon from '@mui/icons-material/Translate'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import BookmarkIcon from '@mui/icons-material/Bookmark'

export default function() {
  const [isOpen, setIsOpen] = useState(false)
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
      label: 'Bookmark',
      href: '/bookmark',
      icon: <BookmarkIcon />
    },
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
            <ListItemButton href={item.href}>
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
    </>
  )
}