import { useEffect, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';
import PropTypes from 'prop-types';
import { getCategoryDimension, getDateDimension, getMaxDateRange } from '../../utils/dataManipulation';

export const TimeSeries = ({
    data,
    filters: {
        selectedParameter, 
        selectedCategories,
        selectedDateRange
    },
    setSelectedDateRange,
}) => {
    const chartRef = useRef();

    useEffect(() => {
        const ndx = crossfilter(data);
        
        // Create dimensions
        const dateDim = getDateDimension(ndx);

        const categoryDim = getCategoryDimension(ndx);
        if(selectedCategories && selectedCategories.length > 0) {
            categoryDim.filterFunction(d => selectedCategories.includes(d));
        }

        // Create group
        const parameterGroup = dateDim.group().reduceSum(d => d[selectedParameter]);
        
        const chart = dc.lineChart(chartRef.current);

        chart
            .width(600)
            .height(300)
            .dimension(dateDim)
            .group(parameterGroup)
            .x(d3.scaleTime().domain(getMaxDateRange(dateDim)))
            .brushOn(true)
            .on('postRedraw', () => {
                setSelectedDateRange(chart.filter() || [])
            });

        if (selectedDateRange && selectedDateRange.length > 0) {
            chart.filter(selectedDateRange);
        }

        chart.render();

        // Clean up
        return () => {
            dc.chartRegistry.clear();
        };
    }, [
        data,
        selectedParameter, 
        selectedCategories,
        selectedDateRange,
        setSelectedDateRange
    ]);

    return (
        <div>
            <h2>Time Series Chart</h2>
            <div ref={chartRef}></div>
        </div>
    );
};

TimeSeries.propTypes = {
    data: PropTypes.array.isRequired,
    filters: PropTypes.shape({
        selectedParameter: PropTypes.string.isRequired,
        selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedDateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    }).isRequired,
    setSelectedDateRange: PropTypes.func.isRequired,
};