import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';
import { useMediaQuery } from '@mui/material';
import { getCategoryDimension, getDateDimension } from '../../utils/dataManipulation';
import './PieChart.scss';
import 'dc/dist/style/dc.css';

export const PieChart = ({
    data,
    selectedParameter, 
    selectedCategories,
    selectedDateRange,
    setSelectedCategories
}) => {
    const chartRef = useRef();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const ndx = crossfilter(data);
        
        // Create dimensions
        const categoryDim = getCategoryDimension(ndx);

        const dateDim = getDateDimension(ndx);
        if(selectedDateRange && selectedDateRange.length > 0) {
            dateDim.filterRange(selectedDateRange);
        }

        // Create group
        const selectedParameterGroup = categoryDim.group().reduceSum((dataElement) => {
            return dataElement[selectedParameter];
        });

        // Set a different color scheme using dc.config.defaultColors
        dc.config.defaultColors(d3.schemeSet2);

        // Create a pie chart
        const chart = dc.pieChart(chartRef.current);

        chart
            .width(isSmallScreen ? 350 : 600)
            .height(isSmallScreen ? 200 : 300)
            .dimension(categoryDim)
            .group(selectedParameterGroup)
            .innerRadius(isSmallScreen ? 20 : 50)
            .slicesCap(isSmallScreen ? 6 : 10)
            .legend(dc.legend())
            .transitionDuration(0)
            .on('filtered', () => {
                setSelectedCategories(chart.filters())
            })
            .emptyTitle('select date range');
        
        selectedCategories.forEach(category => {
            chart.filter(category);
        });
        
        chart.render();
        // Clean up
        return () => {
        };
    }, [
        data,
        selectedParameter, 
        isSmallScreen
    ]);

    return (
        <div>
            <h2>Pie Chart</h2>
            <div className='dc-chart' ref={chartRef}></div>
        </div>
    );
};

PieChart.propTypes = {
    data: PropTypes.array.isRequired,
    selectedParameter: PropTypes.string.isRequired,
    selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedDateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    setSelectedCategories: PropTypes.func.isRequired,
};

export default PieChart;