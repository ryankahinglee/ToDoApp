import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

interface SideBarProps {
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
}

const NavigationSidebar: React.FC<SideBarProps> = ({setDisplay}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  interface ListDrawerItem {
    name: string;
  }

  const ListDrawerItems: ListDrawerItem[] = [
    { name: "To-Do"},
    { name: "Completed"}
  ]



  return (
    <div style={{position: 'fixed', bottom: '0px'}}>
      <div style={{width: '100vw', height: '4vh', backgroundColor: '#dbc8d5', display: 'flex', justifyContent: 'center'}} onClick={toggleDrawer(true)}>

        <Button style={{color: '#333333', fontWeight: 'bold', fontSize: '1.4vh'}}>Dashboard</Button>
      </div>
      <Drawer 
        open={open} 
        onClose={toggleDrawer(false)}
        anchor={'bottom'}
      >
        <Box role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {ListDrawerItems.map((item, key) => {
              return <ListItem key={key}>
                <ListItemButton style={{ width: '100vw'}}
                  onClick={() => {setDisplay(item.name)}}
                >
                  <ListItemText style={{display: 'flex', justifyContent: 'center'}} primary={item.name} />
                </ListItemButton>
              </ListItem>
            })}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default NavigationSidebar