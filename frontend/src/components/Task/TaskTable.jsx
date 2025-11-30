import { Table, Tag, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
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

    const columns = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            width: 100,
            render: (title, record) => (
                <Button
                    type="link"
                    onClick={() => onView(record)}
                    style={{ padding: 0, height: 'auto', fontWeight: 'normal' }}
                >
                    {title}
                </Button>
            ),
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status === 'TODO' && <ClockCircleOutlined />}
                    {status === 'IN_PROGRESS' && <ClockCircleOutlined />}
                    {status === 'DONE' && <CheckCircleOutlined />}
                    {' '}{status}
                </Tag>
            ),
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '-'
        },
        {
            title: 'Срок',
            dataIndex: 'deadline',
            key: 'deadline',
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '-'
        },
        {
            title: 'Действия',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        Редактировать
                    </Button>
                    <Popconfirm
                        title="Удалить задачу?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Удалить
                        </Button>
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