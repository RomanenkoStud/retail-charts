import { useEffect, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import { getDateDimension, getMaxDateRange } from '../../utils/dataManipulation';

export const useTimeSeriesChart = (ndx, selectedParameter, setSelectedDateRange) => {
    const chartRef = useRef(null);

    const chartObjRef = useRef(null);
    const dateDimRef = useRef(null);
    
    useEffect(() => {
        chartObjRef.current = dc.lineChart(chartRef.current);

        chartObjRef.current
            .brushOn(true)
            .on('filtered', () => {
                chartObjRef.current.filter() && 
                    setSelectedDateRange([...chartObjRef.current.filter()])
            })
            .elasticY(true)
            .width(500)
            .height(200)
            .useViewBoxResizing(true);

        return () => {
            // Clean up resources
            setSelectedDateRange([]);
            if (chartObjRef.current) {
                dc.chartRegistry.deregister(chartObjRef.current);
                chartObjRef.current.resetSvg();
            }
            if(dateDimRef.current) {
                dateDimRef.current.dispose();
            }
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

    return chartRef;
};
