import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as dc from 'dc';
import * as d3 from 'd3';
import { getDate, getCategoryDimension } from '../../utils/dataManipulation';
import './PieChart.scss';

export const PieChart = ({ 
    data, 
    selectedParameter, 
    dateRange,
    selectedCategories,
    setSelectedCategories,
}) => {
    const chartRef = useRef();

    useEffect(() => {
        // Create dimensions and groups
        const categoryDim = getCategoryDimension(data);
        const selectedParameterGroup = categoryDim.group().reduceSum((dataElement) => {
        if (dateRange.length === 2) {
            const [startDate, endDate] = dateRange;

            const date = getDate(dataElement);

            if (
            (date >= startDate) && (date <= endDate)
            ) {
                return dataElement[selectedParameter];
            } else {
                return 0;
            }
        }

        return 0;
        });

        // Set a different color scheme using dc.config.defaultColors
        dc.config.defaultColors(d3.schemeSet2);

        // Create a pie chart
        const pieChart = dc.pieChart(chartRef.current);

        pieChart
            .width(600)
            .height(300)
            .dimension(categoryDim)
            .group(selectedParameterGroup)
            .innerRadius(50)
            .slicesCap(10)
            .legend(dc.legend())
            .on('postRedraw', () => {
                const filters = pieChart.filters();
                setSelectedCategories(filters);
            })
            .render();

        pieChart.filter(selectedCategories);

        // Clean up
        return () => {
        dc.chartRegistry.clear();
        };
    }, [
        data, 
        selectedParameter, 
        dateRange, 
        selectedCategories, setSelectedCategories
    ]);

    return (
        <div>
            <h2>Pie Chart</h2>
            <div className='dc-chart' ref={chartRef}></div>
        </div>
    );
};

PieChart.propTypes = {
    data: PropTypes.array,
    selectedParameter: PropTypes.oneOf(['markdown', 'revenues', 'margin']).isRequired,
    dateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelectedCategories: PropTypes.func.isRequired,
};

export default PieChart;