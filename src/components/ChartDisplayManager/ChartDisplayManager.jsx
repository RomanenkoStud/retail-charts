import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import crossfilter from 'crossfilter2';
import * as dc from 'dc';
import * as d3 from 'd3';
import { Box } from '@mui/material';

import { usePieChart } from '../../hooks/usePieChart';
import { useTimeSeriesChart } from '../../hooks/useTimeSeriesChart';

import 'dc/dist/style/dc.css';

const CHART_TYPES = {
    PIE: 'pie',
    TIME_SERIES: 'timeseries',
};
const DISPLAYED_CHART_OPTIONS = [...Object.values(CHART_TYPES), 'none'];

//More at https://observablehq.com/@d3/d3v6-migration-guide#es2015
dc.d3compat.eventHandler = handler => function (event, data) {
    handler.call(this, data, event)
}

dc.config.defaultColors(d3.schemeSet2);

export const ChartDisplayManager = ({
    data, 
    displayedChart, 
    selectedParameter,
    setSelectedCategories,
    setSelectedDateRange
}) => {
    const [ndx, setNdx] = useState(crossfilter([]));

    const pieChartRef = usePieChart(ndx, selectedParameter, setSelectedCategories);
    const timeSeriesChartRef = useTimeSeriesChart(ndx, selectedParameter, setSelectedDateRange);


    useEffect(() => {
        setNdx(crossfilter(data));
    }, [data]);
    
    useEffect(() => {
        console.log('Mount ChartDisplayManager')
    
        return () => {
            console.log('Unmount ChartDisplayManager')
        };
    }, []);

    useEffect(() => {
        // Rerender hidden chart
        dc.renderAll();
    }, [displayedChart]);

    return (
        <Box>
            <div ref={pieChartRef} hidden={displayedChart!==CHART_TYPES.PIE}/>
            <div ref={timeSeriesChartRef} hidden={displayedChart!==CHART_TYPES.TIME_SERIES}/>
        </Box>
    )
}

ChartDisplayManager.propTypes = {
    data: PropTypes.array.isRequired,
    displayedChart: PropTypes.oneOf(DISPLAYED_CHART_OPTIONS).isRequired,
    selectedParameter: PropTypes.string.isRequired,
    setSelectedCategories: PropTypes.func.isRequired,
    setSelectedDateRange: PropTypes.func.isRequired,
};
