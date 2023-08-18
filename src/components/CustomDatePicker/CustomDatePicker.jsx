import { DatePicker } from '@mui/x-date-pickers';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

export const CustomDatePicker = ({ maxDateRange, dateRange, setDateRange }) => {
    const [minDate, maxDate] = maxDateRange;
    const [startDate, endDate] = dateRange;

    return (
        <Box
            sx={{ display: 'flex', gap: 5 }}
        >
            <DatePicker
                label={'Start date'}
                views={['year', 'month', 'day']}
                value={startDate}
                onChange={(newStartDate) => setDateRange(([, oldEndDate]) => (
                    dateRange.length !== 2 ? [newStartDate, oldEndDate] : [newStartDate, maxDate]
                ))}
                shouldDisableDate={(date) => {
                    return (date < minDate || (date > endDate || date > maxDate));
                }}
            />
            <DatePicker
                label={'End date'}
                views={['year', 'month', 'day']}
                value={endDate}
                onChange={(newEndDate) => setDateRange(([oldStartDate, ]) => (
                    dateRange.length !== 2 ? [oldStartDate, newEndDate] : [minDate, newEndDate]
                ))}
                shouldDisableDate={(date) => {
                    return ((date < startDate || date < minDate) || date > maxDate);
                }}
            />
        </Box>
    );
};

CustomDatePicker.propTypes = {
    maxDateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    dateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    setDateRange: PropTypes.func.isRequired,
};
