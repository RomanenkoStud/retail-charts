import { useEffect, useRef } from 'react';
import * as dc from 'dc';
import { getCategoryDimension } from '../../utils/dataManipulation';

export const usePieChart = (ndx, selectedParameter, setSelectedCategories) => {
    const chartRef = useRef(null);

    const chartObjRef = useRef(null);
    const categoryDimRef = useRef(null);
    
    useEffect(() => {
        chartObjRef.current = dc.pieChart(chartRef.current);

        chartObjRef.current
            .legend(dc.legend())
            .on('filtered', () => {
                setSelectedCategories([...chartObjRef.current.filters()]);
            })
            .emptyTitle('select date range')
            .width(500)
            .height(200)
            .useViewBoxResizing(true);
        
        chartObjRef.current
            .innerRadius(20)
            .slicesCap(10);

        return () => {
            // Clean up resources
            setSelectedCategories([]);
            if (chartObjRef.current) {
                dc.chartRegistry.deregister(chartObjRef.current);
                chartObjRef.current.resetSvg();
            }
            if(categoryDimRef.current) {
                categoryDimRef.current.dispose();
            }
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

    return chartRef;
};
