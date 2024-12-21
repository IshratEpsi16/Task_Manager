import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TaskList from './components/Task_List/TaskList';
import TaskDetails from './components/Task_Details/TaskDetails';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Login /> */} {/* Uncomment this if you need a login page */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/taskdetails/:id" element={<TaskDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
