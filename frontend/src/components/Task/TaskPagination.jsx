import { Pagination } from 'antd';
import PropTypes from 'prop-types';

const TaskPagination = ({
    currentPage,
    pageSize,
    totalTasks,
    onPageChange,
    showQuickJumper = true,
    showTotal = true,
    align = 'right'
}) => {
    const handleChange = (page, size) => {
        onPageChange(page - 1, size);
    };

    const paginationStyle = {
        marginTop: 16,
        textAlign: align
    };

    return (
        <div style={paginationStyle}>
            <Pagination
                current={currentPage + 1}
                pageSize={pageSize}
                total={totalTasks}
                onChange={handleChange}
                onShowSizeChange={handleChange}
                showQuickJumper={showQuickJumper}
                showTotal={showTotal ? (total, range) =>
                    `Задачи ${range[0]}-${range[1]} из ${total}`
                    : undefined}
            />
        </div>
    );
};

TaskPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalTasks: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    showQuickJumper: PropTypes.bool,
    showTotal: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right'])
};

export default TaskPagination;