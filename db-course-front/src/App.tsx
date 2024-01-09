/*import React from 'react';
import FlowerTable from './FlowerTable'; // Подставьте правильный путь к файлу FlowerTable
import './App.css';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <FlowerTable />
        </header>
      </div>
  );
}

export default App;
*/


import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './App.css';
import ResourcesPage from "./pages/ResourcesPage";
import {Statictic} from "./components/Statictic";
import FlowerTableAdmin from "./pages/FlowerTableAdmin";

function App() {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/homeAdmin" element={<FlowerTableAdmin />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resurses" element={<ResourcesPage/>} />
            <Route path="/statistic" element={<Statictic/>} />
        </Routes>
    );
}

export default App;
