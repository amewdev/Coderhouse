let currentFilters = {};

const setFilters = (filters) => {
    currentFilters = filters;
};

const getFilters = () => {
    return currentFilters;
};

export { setFilters, getFilters };