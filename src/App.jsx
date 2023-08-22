import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { NavBar } from './components/NavBar';
import { PieChart } from './components/PieChart';
import { TimeSeries } from './components/TimeSeries';
import { SelectedFilters } from './components/SelectedFilters';
import { baseUrl } from './baseUrl';
import './App.scss';

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

function App() {
  const [data, setData] = useState([]);
   // Separate state for each filter parameter
  const [selectedParameter, setSelectedParameter] = useState(PARAMETERS[0]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([]);

  const resetFilters = () => {
    setSelectedParameter(PARAMETERS[0]);
    setSelectedCategories([]);
    setSelectedDateRange([]);
  };

  useEffect(() => {
    d3.csv(CSV_FILE_PATH).then((loadedData) => {
      setData(loadedData);
    });
  }, []);

  return (
    <Router>
      <CssBaseline />
      <NavBar 
        pages={PAGES}
        dropDownValues={PARAMETERS}
        selected={selectedParameter}
        setSelected={(newParameter) => {
          setSelectedParameter(newParameter);
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
          <Route path="pie" element={
            <PieChart
              data={data} 
              selectedParameter={selectedParameter}
              selectedDateRange={selectedDateRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={(newCategories) => {
                setSelectedCategories(newCategories);
              }}
            />
          } />
          <Route path="timeseries" element={
            <TimeSeries
              data={data}
              selectedParameter={selectedParameter}
              selectedDateRange={selectedDateRange}
              selectedCategories={selectedCategories}
              setSelectedDateRange={(newDateRange) => {
                setSelectedDateRange(newDateRange);
              }}
            />
          } />
        </Routes>
      </Box>
      <SelectedFilters 
        selectedParameter={selectedParameter}
        selectedDateRange={selectedDateRange}
        selectedCategories={selectedCategories}
      />
    </Router>
  )
}

export default App
