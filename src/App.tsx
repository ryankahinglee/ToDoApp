import * as React from 'react';
import './App.css';
import Todo from './ToDo';
import Completed from './Completed'
import NavigationSideBar from './components/NavigationSidebar';

function App() {

  const [display, setDisplay] = React.useState<string>("To-Do")

  // List items
  type StringObject = { [key: string]: string };
  const [listItems, setListItems] = React.useState<StringObject>({})
  const [completedItems, setCompletedItems] = React.useState<StringObject>({})

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      {display === "To-Do" && (
        <Todo listItems={listItems} setListItems={setListItems} completedItems={completedItems} setCompletedItems={setCompletedItems}/>
      )}
      {display === "Completed" && (
        <Completed completedItems={completedItems}/>
      )}
      <NavigationSideBar  setDisplay={setDisplay} />
    </div>
  );
}

export default App;
