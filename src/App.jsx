import { useState, useEffect, useMemo } from 'react'
import * as d3 from 'd3';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { NavBar } from './components/NavBar'
import { PieChart } from './components/PieChart'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import eng from 'date-fns/locale/en-US';
import './App.scss';
import { TimeSeries } from './components/TimeSeries';
import { getMaxDateRange, getDateDimension } from './utils/dataManipulation';
import { CustomDatePicker } from './components/CustomDatePicker';

const pages = [
  {title: 'Pie Chart', route: '/'},
  {title: 'Time Series Chart', route: '/timeseries'},
];

const csvFilePath = './data.csv';

function App() {
  const [dateRange, setDateRange] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [data, setData] = useState([]);

  const [startDate, endDate] = dateRange;

  const maxDateRange = useMemo(() => {
    return getMaxDateRange(getDateDimension(data));
  }, [data]);

  useEffect(() => {
    d3.csv(csvFilePath).then((loadedData) => {
      setData(loadedData);
    });
  }, []);

  return (
    <Router>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={eng}>
      <CssBaseline />
      <NavBar pages={pages} />
      <Box
        sx={{ pt: 10 }}
      >

        <Box>

        <CustomDatePicker 
          maxDateRange={maxDateRange}
          dateRange={dateRange}
          setDateRange={(newDateRange) => {
            setDateRange(newDateRange)
          }}
        />
          <Routes>
            <Route path="/" element={
              <>
                <h1>Welcome to the Dashboard</h1>
                <Box>
                  <PieChart 
                    data={data}
                    selectedParameter="markdown"
                    dateRange={[startDate, endDate]}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={(newCategories) => {
                      setSelectedCategories(newCategories)
                    }}
                  />
                </Box>
                <Box>
                  <TimeSeries 
                    data={data} 
                    selectedParameter="markdown"
                    dateRange={dateRange}
                    updateDateRange={(newDateRange) => {
                      setDateRange(newDateRange)
                    }}
                    selectedCategories={selectedCategories}
                  />
                </Box>
              </>
            } />
          </Routes>
        </Box>
      </Box>
    </LocalizationProvider>
    </Router>
  )
}

export default App
