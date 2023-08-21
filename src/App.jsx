import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

import { NavBar } from './components/NavBar';
import { PieChart } from './components/PieChart';
import { TimeSeries } from './components/TimeSeries';
import { SelectedFilters } from './components/SelectedFilters';
import './App.scss';

const CSV_FILE_PATH = './data.csv';
const PAGES = [
  {title: 'Pie Chart', route: '/pie'},
  {title: 'Time Series Chart', route: '/timeseries'},
];
const PARAMETERS = [
  'markdown', 
  'revenues', 
  'margin'
];

const initialState = {
  selectedParameter: PARAMETERS[0],
  selectedCategories: [],
  selectedDateRange: [],
};

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialState);

  const resetFilters = () => {
    setFilters(initialState);
  };

  useEffect(() => {
    d3.csv(CSV_FILE_PATH).then((loadedData) => {
      setData(loadedData);
    });
  }, []);

  const HomePage = () => (
    <Box>
      <h1>Welcome to Dashboard!</h1>
      {PAGES.map((page) => (
        <Link 
          key={page.title} 
          to={page.route} 
          style={{ textDecoration: 'none' }}
        >
          <h2>Go to {page.title}</h2>
        </Link>
      ))}
    </Box>
  );

  return (
    <Router>
      <CssBaseline />
      <NavBar 
        pages={PAGES}
        dropDownValues={PARAMETERS}
        selected={filters.selectedParameter}
        setSelected={(newParameter) => {
          setFilters({ ...filters, selectedParameter: newParameter });
        }}
        onReset={() => {
          resetFilters();
        }}
      />
      <Box>
        <Routes>
          <Route path="/" element={
            <HomePage/>
          } />
          <Route path="/pie" element={
            <PieChart
              data={data} 
              filters={filters}
              setSelectedCategories={(newCategories) => {
                setFilters({ ...filters, selectedCategories: newCategories });
              }}
            />
          } />
          <Route path="/timeseries" element={
            <TimeSeries
              data={data}
              filters={filters}
              setSelectedDateRange={(newDateRange) => {
                setFilters({ ...filters, selectedDateRange: newDateRange });
              }}
            />
          } />
        </Routes>
      </Box>
      <SelectedFilters filters={filters}/>
    </Router>
  )
}

export default App
