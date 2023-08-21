import PropTypes from 'prop-types';
import './SelectedFilters.scss';

export const SelectedFilters = ({
    selectedParameter, 
    selectedCategories,
    selectedDateRange,
}) => {
    const renderMultipleSelection = (id, heading, items, formatter) => (
        <div>
            <h3 className="selected__heading">{heading}</h3>
            <ul id={id} className="selected__list">
                {items.length > 0 ? (
                    items.map((item) => (
                        <li 
                            key={formatter ? formatter(item) : item} 
                            className="selected__list-item"
                        >
                            {formatter ? formatter(item) : item}
                        </li>
                    ))
                ) : (
                    <li className="selected__list-item">None selected</li>
                )}
            </ul>
        </div>
    );

    const renderSelection = (id, heading, item, formatter) => (
        <div>
            <h3 className="selected__heading">{heading}</h3>
            <p id={id} className="selected__element">
                {formatter ? formatter(item) : item}
            </p>
        </div>
    );

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <div className="selected">
            {renderMultipleSelection(
                "categories", 
                "Selected Categories:", 
                selectedCategories
            )}
            {renderSelection(
                "parameter", 
                "Selected Parameter:", 
                selectedParameter
            )}
            {renderMultipleSelection(
                "date-range", 
                "Selected Date Range:", 
                selectedDateRange, 
                date => formatDate(date)
            )}
        </div>
    );
}

SelectedFilters.propTypes = {
    selectedParameter: PropTypes.string.isRequired,
    selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedDateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};
