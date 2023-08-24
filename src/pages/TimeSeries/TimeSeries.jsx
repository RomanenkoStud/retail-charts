import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const TimeSeries = ({
    setDisplayedChart
}) => {
    useEffect(() => {
        setDisplayedChart('timeseries');
        return () => {
            setDisplayedChart('none');
        };
    }, [setDisplayedChart]);
    
    return (
        <h2>Time Series Chart:</h2>
    );
};

TimeSeries.propTypes = {
    setDisplayedChart: PropTypes.func.isRequired,
};