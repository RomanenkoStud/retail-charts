import * as d3 from 'd3';

export const getDate = (data) => {
    if(!data) {
        return new Date();
    }
    const year = +data.year_ref;
    const week = +data.week_ref;
    return d3.timeWeek.offset(new Date(year, 0, 1), week - 1);
}

export const getCategoryDimension = (ndx) => {
    return ndx.dimension((dataElement) => dataElement.category_desc);
}

export const getDateDimension = (ndx) => {
    return ndx.dimension(d => {
        const year = +d.year_ref;
        const week = +d.week_ref;
        const startDate = d3.timeWeek.offset(new Date(year, 0, 1), week - 1);
        return startDate;
    });
}

export const getMaxDateRange = (dateDimension) => {
    // Calculate the minimum and maximum dates
    const minDateRecord = dateDimension.bottom(1)[0];
    const maxDateRecord = dateDimension.top(1)[0];

    const minDate = getDate(minDateRecord);
    const maxDate = getDate(maxDateRecord);

    return [minDate, maxDate];
}