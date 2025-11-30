import { Table, Tag, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { PropTypes } from 'prop-types'
import dayjs from 'dayjs'

const TaskTable = ({
    tasks,
    loading,
    onEdit,
    onDelete,
    onView
}) => {
    const statusColors = {
        'TODO': 'orange',
        'IN_PROGRESS': 'blue',
        'DONE': 'green'
    };

    const statusLabels = {
        'TODO': 'Сделать',
        'IN_PROGRESS': 'В процессе',
        'DONE': 'Выполнено'
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (title, record) => (
                <Button
                    type="link"
                    onClick={() => onView(record)}
                    style={{
                        padding: 0,
                        height: 'auto',
                        fontWeight: 'normal',
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word'
                    }}
                >
                    {title}
                </Button>
            ),
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (description) => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        lineHeight: '1.4'
                    }}
                >
                    {description || '-'}
                </div>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status === 'TODO' && <ClockCircleOutlined />}
                    {status === 'IN_PROGRESS' && <ClockCircleOutlined />}
                    {status === 'DONE' && <CheckCircleOutlined />}
                    {' '}{statusLabels[status]}
                </Tag>
            ),
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date) => date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '-'
        },
        {
            title: 'Срок',
            dataIndex: 'deadline',
            key: 'deadline',
            width: 150,
            render: (date) => date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '-'
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                        size="small"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Удалить задачу?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 800 }}
        />
    );
};

export default TaskTable;

TaskTable.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        status: PropTypes.oneOf(['TODO', 'IN_PROGRESS', 'DONE']),
        deadline: PropTypes.string,
    })).isRequired,
    loading: PropTypes.bool,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
};