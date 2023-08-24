import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const PieChart = ({
    setDisplayedChart
}) => {
    useEffect(() => {
        setDisplayedChart('pie');
        return () => {
            setDisplayedChart('none');
        };
    }, [setDisplayedChart]);
    
    return (
        <h2>Pie Chart:</h2>
    )
};

PieChart.propTypes = {
    setDisplayedChart: PropTypes.func.isRequired,
};

export default PieChart;