import { useEffect, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';

import { useMediaQuery } from '@mui/material';
import { getCategoryDimension } from '../../utils/dataManipulation';

const SIZE = {
    small: {
        width: 350,
        height: 200,
        innerRadius: 20,
        slicesCap: 6,
    },
    default: {
        width: 600,
        height: 300,
        innerRadius: 50,
        slicesCap: 10,
    }
}

export const usePieChart = (ndx, selectedParameter, setSelectedCategories) => {
    const chartRef = useRef(null);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const chartObjRef = useRef(null);
    const categoryDimRef = useRef(null);
    
    useEffect(() => {
        dc.d3compat.eventHandler =  handler => function eventHandler (a, b) {
            handler.call(this, b, a);
        },
        

        dc.config.defaultColors(d3.schemeSet2);

        chartObjRef.current = dc.pieChart(chartRef.current);

        chartObjRef.current
            .legend(dc.legend())
            .on('filtered', () => {
                setSelectedCategories([...chartObjRef.current.filters()]);
            })
            .emptyTitle('select date range');

        return () => {
            // Clean up resources
        };
    }, [
        ndx,
        setSelectedCategories
    ]);

    useEffect(() => {
        categoryDimRef.current = getCategoryDimension(ndx);

        chartObjRef.current
            .dimension(categoryDimRef.current)
    }, [
        ndx,
    ]);

    useEffect(() => {
        const selectedParameterGroup = categoryDimRef.current.group().reduceSum(dataElement => {
            return dataElement[selectedParameter];
        });

        chartObjRef.current
            .group(selectedParameterGroup);
        chartObjRef.current.render();
    }, [
        ndx,
        selectedParameter,
    ]);

    useEffect(() => {
        const config = isSmallScreen ? SIZE.small : SIZE.default;

        const {
            width,
            height,
            innerRadius,
            slicesCap
        } = config;

        chartObjRef.current
            .width(width)
            .height(height)
            .innerRadius(innerRadius)
            .slicesCap(slicesCap);

        chartObjRef.current.redraw();

    }, [
        ndx,
        isSmallScreen
    ]);

    return chartRef;
};
