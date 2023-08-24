import { useState, useEffect } from 'react';
import * as d3 from 'd3';

import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { NavBar } from './components/NavBar';
import { SelectedFilters } from './components/SelectedFilters';
import { ChartDisplayManager } from './components/ChartDisplayManager';
import { baseUrl } from './baseUrl';

import { Home } from './pages/Home';
import { PieChart } from './pages/PieChart';
import { TimeSeries } from './pages/TimeSeries';

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

  const [displayedChart, setDisplayedChart] = useState('none');

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
      <Box>
        <Routes>
          <Route path="/" element={
            <Home pages={PAGES}/>
          } />
          <Route path="pie" element={
            <Box>
              <PieChart setDisplayedChart={setDisplayedChart}/>
              {isLoading && <CircularProgress />}
            </Box>
          } />
          <Route path="timeseries" element={
            <Box>
              <TimeSeries setDisplayedChart={setDisplayedChart}/>
              {isLoading && <CircularProgress />}
            </Box>
          } />
        </Routes>
        {!isLoading && (
          <ChartDisplayManager 
            data={data}
            displayedChart={displayedChart}
            selectedParameter={selectedParameter}
            setSelectedCategories={setSelectedCategories}
            setSelectedDateRange={setSelectedDateRange}
          />
        )}
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
