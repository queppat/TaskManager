import PropTypes from 'prop-types';
import { Input, Select, DatePicker, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react'; // Добавляем импорты

const { Search } = Input;
const { Option } = Select;

const TaskFilters = ({
  filters,
  sort,
  onSearch,
  onStatusFilter,
  onDueDateFilter,
  onSortChange,
  onResetFilters,
  loading
}) => {
  const [searchValue, setSearchValue] = useState(filters.title);

  useEffect(() => {
    setSearchValue(filters.title);
  }, [filters.title]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleReset = () => {
    setSearchValue('');
    onResetFilters();
  };

  return (
    <div className="filters-section">
      <Space size="middle" wrap>
        <Search
          placeholder="Поиск по названию..."
          allowClear
          value={searchValue}
          style={{ width: 200 }}
          onSearch={onSearch}
          onChange={(e) => {
            handleSearchChange(e.target.value);
          }}
          loading={loading}
          enterButton
        />

        <Select
          placeholder="Статус"
          allowClear
          value={filters.status || undefined}
          style={{ width: 150 }}
          onChange={onStatusFilter}
          disabled={loading}
        >
          <Option value="TODO">В ожидании</Option>
          <Option value="IN_PROGRESS">В работе</Option>
          <Option value="DONE">Выполнено</Option>
        </Select>

        <DatePicker
          placeholder="Срок выполнения"
          value={filters.deadline}
          style={{ width: 180 }}
          onChange={onDueDateFilter}
          allowClear
          disabled={loading}
        />

        <Select
          placeholder="Сортировка"
          value={sort}
          style={{ width: 200 }}
          onChange={onSortChange}
          disabled={loading}
        >
          <Option value="createdAt,desc">По дате создания (новые)</Option>
          <Option value="createdAt,asc">По дате создания (старые)</Option>
          <Option value="deadline,asc">По сроку (сначала ближайшие)</Option>
          <Option value="deadline,desc">По сроку (сначала дальние)</Option>
        </Select>

        <Button
          onClick={handleReset}
          icon={<ReloadOutlined />}
          disabled={loading}
        >
          Сбросить
        </Button>
      </Space>
    </div>
  );
};

TaskFilters.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string,
    status: PropTypes.string,
    deadline: PropTypes.any,
  }).isRequired,
  sort: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onStatusFilter: PropTypes.func.isRequired,
  onDueDateFilter: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default TaskFilters;