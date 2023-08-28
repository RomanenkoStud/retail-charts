import { useState, useEffect } from 'react';
import * as d3 from 'd3';

import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { NavBar } from './components/NavBar';
import { SelectedFilters } from './components/SelectedFilters';
import { ChartDisplayManager } from './components/ChartDisplayManager';
import { baseUrl } from './baseUrl';

import { Home } from './pages/Home';

import './App.scss';
import 'dc/dist/style/dc.css';

const CSV_FILE_PATH = `${baseUrl}data.csv`;
const PAGES = [
  {title: 'Pie Chart', route: "pie"},
  {title: 'Time Series Chart', route: "timeseries"},
];
const PARAMETERS = [
  'markdown', 
  'revenues', 
  'margin'
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  // Separate state for each filter parameter
  const [selectedParameter, setSelectedParameter] = useState(PARAMETERS[0]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([]);

  const resetFilters = () => {
    setSelectedParameter(PARAMETERS[0]);
    setData([...data]);
  };

  useEffect(() => {
    d3.csv(CSV_FILE_PATH)
      .then((loadedData) => {
        setData(loadedData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Router>
      <CssBaseline />
      <NavBar
        pages={PAGES}
        dropDownValues={PARAMETERS}
        selected={selectedParameter}
        setSelected={setSelectedParameter}
        onReset={resetFilters}
      />
      <Box maxWidth="840px">
        <Routes>
          <Route path="/" element={
            <Home pages={PAGES}/>
          } />
          <Route path="pie" element={
            <Box>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <ChartDisplayManager 
                  data={data}
                  displayedChart="pie"
                  selectedParameter={selectedParameter}
                  setSelectedCategories={setSelectedCategories}
                  setSelectedDateRange={setSelectedDateRange}
                />
              )}
            </Box>
          } />
          <Route path="timeseries" element={
            <Box>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <ChartDisplayManager 
                  data={data}
                  displayedChart="timeseries"
                  selectedParameter={selectedParameter}
                  setSelectedCategories={setSelectedCategories}
                  setSelectedDateRange={setSelectedDateRange}
                />
              )}
            </Box>
          } />
        </Routes>
        <Box>
          <SelectedFilters 
            selectedParameter={selectedParameter}
            selectedDateRange={selectedDateRange}
            selectedCategories={selectedCategories}
          />
        </Box>
      </Box>
    </Router>
  )
}

export default App
