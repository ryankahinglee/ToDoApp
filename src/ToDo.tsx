import React from 'react';
import { Box, Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';

type StringObject = { [key: string]: string };

interface TodoInterface {
  listItems: StringObject
  setListItems: React.Dispatch<React.SetStateAction<StringObject>>;
  completedItems: StringObject
  setCompletedItems: React.Dispatch<React.SetStateAction<StringObject>>;
}

const Todo: React.FC<TodoInterface> = ({listItems, setListItems, completedItems, setCompletedItems}) => {

  const [open, setOpen] = React.useState<boolean>(false);

  const handleDeleteItem = (itemToDelete: string) => {
    const updatedItems = { ...listItems };
    delete updatedItems[itemToDelete];
    setListItems(updatedItems);
  };

  const handleCompleteItem = (itemToComplete: string) => {
    const updatedItems = { ...listItems };
    delete updatedItems[itemToComplete];
    setListItems(updatedItems);

    // Complete Item
    const updatedCompletedItems = completedItems
    completedItems[itemToComplete] = itemToComplete
    setCompletedItems(updatedCompletedItems);
  };

  return <div style={{display: 'flex', justifyContent: 'center',  width: '100%', height: '100%', border: '4px solid #dbc8d5', boxSizing: 'border-box', padding: '10px', backgroundColor: '#f7f4f7'}}>
    <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <h1 style={{margin: 'auto', marginTop: '10px', marginBottom: '10px', color: '#333333'}}>To-do List Today</h1>
      <hr style={{ width: '100%'}}/>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            color="secondary"
            variant="contained"
            style={{fontWeight: 'lighter'}}
          >
            {Object.keys(listItems).length}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{fontWeight: 'bold'}}
            onClick={() => {setOpen(true)}}
          >
            +
          </Button>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {Object.keys(listItems).map((item) => (
            <Box key={item} sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', marginTop: '10px', marginBottom: '10px', height: '40px', alignItems:'center'}}>
              <p>● {item}</p>
              <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <Button
                  color="secondary"
                  variant="contained"
                  sx={{width: '40px'}}
                  value={item}
                  onClick={(event) => {
                    const completeItem = (event.target as HTMLButtonElement).value
                    handleCompleteItem(completeItem);
                  }}
                >
                  ✓
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  sx={{width: '40px'}}
                  value={item}
                  onClick={(event) => {
                    const deleteItem = (event.target as HTMLButtonElement).value
                    handleDeleteItem(deleteItem);
                  }}
                >
                  X
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        <AddItemDialog open={open} onClose={setOpen} setListItems={setListItems} listItems={listItems}/>
      </Box>

    </Box>
  </div>;
};

export default Todo;

interface DialogProps {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setListItems: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  listItems: { [key: string]: string }
}

const AddItemDialog: React.FC<DialogProps> = ({open, onClose, setListItems, listItems}) => {
  const handleClose = () => {
    onClose(false);
  };


  const [item, setItem] = React.useState<string>("")
  return (
    <Dialog onClose={handleClose} open={open} 
      sx={{
        '& .MuiDialog-paper': {
          width: '300px',
          height: '200px'
        },
      }}
    >
      <Box sx={{padding: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <DialogTitle>Add To-Do Item</DialogTitle>
        <TextField 
          value={item}
          onChange={(event) => {
            if (event.target.value.length < 20)
            setItem(event.target.value)
          }}
        
        />
        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              onClose(false)
              setItem("")
            
            }}
          >
            Close
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              if (item !== "") {
                let currentItems = listItems
                if (!(item in currentItems)) {
                  currentItems[item] = item
                  setListItems(currentItems)
                }

              }
              setItem("")
              onClose(false)}
            }
          >
            Add Item
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}