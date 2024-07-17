import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function() {
  return <>
    <div>实现衣柜功能</div>
    <Fab color="primary" aria-label="add" sx={{bottom: 16, right: 16, position: 'fixed'}}>
      <AddIcon />
    </Fab>
  </>
}