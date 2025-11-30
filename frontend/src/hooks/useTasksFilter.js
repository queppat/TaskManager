import { useState, useCallback, useRef } from 'react';

export const useTaskFilters = (initialFilters = {}, initialSort = 'createdAt,desc') => {
  const [filters, setFilters] = useState({
    title: '',
    status: '',
    deadline: null,
    ...initialFilters
  });
  
  const [sort, setSort] = useState(initialSort);
  
  const searchTimeoutRef = useRef(null);

  const handleSearch = useCallback((value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, title: value }));
    }, 500);
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setFilters(prev => ({ ...prev, status: value }));
  }, []);

  const handleDueDateFilter = useCallback((date) => {
    setFilters(prev => ({ ...prev, deadline: date }));
  }, []);

  const handleSortChange = useCallback((value) => {
    setSort(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setFilters({
      title: '',
      status: '',
      deadline: null
    });
    setSort('createdAt,desc');
  }, []);

  return {
    filters,
    sort,
    handlers: {
      handleSearch,
      handleStatusFilter,
      handleDueDateFilter,
      handleSortChange,
      handleResetFilters
    }
  };
};