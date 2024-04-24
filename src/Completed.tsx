import React from 'react';
import { Box, Button } from '@mui/material';

type StringObject = { [key: string]: string };

interface CompletedInterface {
  completedItems: StringObject
}

const Completed: React.FC<CompletedInterface> = ({completedItems}) => {

  return <div style={{display: 'flex', justifyContent: 'center',  width: '100%', height: '100%', border: '4px solid #dbc8d5', boxSizing: 'border-box', padding: '10px', backgroundColor: '#f7f4f7'}}>
    <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <h1 style={{margin: 'auto', marginTop: '10px', marginBottom: '10px', color: '#333333'}}>Completed Today</h1>
      <hr style={{ width: '100%'}}/>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            color="secondary"
            variant="contained"
            style={{fontWeight: 'lighter'}}
          >
            {Object.keys(completedItems).length}
          </Button>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {Object.keys(completedItems).map((item) => (
            <Box key={item} sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', marginTop: '10px', marginBottom: '10px', height: '40px'}}>
              <p>● {item}</p>
            </Box>
          ))}
        </Box>
      </Box>

    </Box>
  </div>;
};

export default Completed;
