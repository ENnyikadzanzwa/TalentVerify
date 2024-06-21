import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateItem from './CreateItem';
import ItemList from './ItemList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateItem />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/" element={<ItemList />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;
