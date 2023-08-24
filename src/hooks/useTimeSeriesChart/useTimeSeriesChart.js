import { useEffect, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import { useMediaQuery } from '@mui/material';
import { getDateDimension, getMaxDateRange } from '../../utils/dataManipulation';

const SIZE = {
    small: {
        width: 350,
        height: 200,
    },
    default: {
        width: 600,
        height: 300,
    }
}

export const useTimeSeriesChart = (ndx, selectedParameter, setSelectedDateRange) => {
    const chartRef = useRef(null);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const chartObjRef = useRef(null);
    const dateDimRef = useRef(null);
    
    useEffect(() => {
        dc.d3compat.eventHandler =  handler => function eventHandler (a, b) {
            handler.call(this, b, a);
        },

        chartObjRef.current = dc.lineChart(chartRef.current);

        chartObjRef.current
            .brushOn(true)
            .on('filtered', () => {
                chartObjRef.current.filter() && 
                    setSelectedDateRange([...chartObjRef.current.filter()] || [])
            })
            .elasticY(true);

        return () => {
            // Clean up resources
        };
    }, [
        ndx,
        setSelectedDateRange
    ]);

    useEffect(() => {
        dateDimRef.current = getDateDimension(ndx);

        chartObjRef.current
            .dimension(dateDimRef.current)
            .x(d3.scaleTime().domain(getMaxDateRange(dateDimRef.current)));
    }, [
        ndx,
    ]);

    useEffect(() => {
        const selectedParameterGroup = dateDimRef.current.group().reduceSum(dataElement => {
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
        } = config;

        chartObjRef.current
            .width(width)
            .height(height);

        chartObjRef.current.render();

    }, [
        ndx,
        isSmallScreen
    ]);

    return chartRef;
};
