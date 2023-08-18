import { useEffect, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { getMaxDateRange, getDateDimension } from '../../utils/dataManipulation';

export const TimeSeries = ({ 
    data, 
    selectedParameter, 
    selectedCategories, 
    dateRange, updateDateRange 
}) => {
    const chartRef = useRef();

    useEffect(() => {
        const filteredData = selectedCategories.length > 0
            ? data.filter(d => selectedCategories.includes(d.category_desc))
            : data;

        const dateDim = getDateDimension(filteredData);

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
                if (chart.filter()) {
                    const [start, end] = chart.filter();
                    updateDateRange([start, end]);
                }
            })
            .render();

        chart.filter(dateRange);

        // Clean up
        return () => {
        dc.chartRegistry.clear();
        };
    }, [data, selectedParameter, selectedCategories, dateRange, updateDateRange]);

    return (
        <div>
            <h2>Time Series Chart</h2>
            <div ref={chartRef}></div>
        </div>
    );
};

TimeSeries.propTypes = {
    data: PropTypes.array.isRequired,
    selectedParameter: PropTypes.oneOf(['markdown', 'revenues', 'margin']).isRequired,
    selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    dateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    updateDateRange: PropTypes.func.isRequired,
};