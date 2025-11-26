import { useState, useEffect } from 'react';
import {
    Layout,
    Card,
    Button,
    Table,
    Tag,
    Space,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    message,
    Popconfirm,
    Statistic,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { authService } from '../../services/authService';
import { taskService } from '../../services/taskService';
import './Dashboard.css';

const { Header, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form] = Form.useForm();

    const statusColors = {
        'TODO': 'orange',
        'IN_PROGRESS': 'blue',
        'DONE': 'green'
    };

    const loadTasks = async () => {
        setLoading(true);
        try {
            const tasksData = await taskService.getTasks();
            setTasks(tasksData);
        } catch (error) {
            message.error('Ошибка загрузки задач');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleSubmit = async (values) => {
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, values);
                message.success('Задача обновлена');
            } else {
                await taskService.createTask(values);
                message.success('Задача создана');
            }
            setModalVisible(false);
            setEditingTask(null);
            form.resetFields();
            loadTasks();
        } catch (error) {
            message.error('Ошибка сохранения задачи');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            message.success('Задача удалена');
            loadTasks();
        } catch (error) {
            message.error('Ошибка удаления задачи');
        }
    };

    const handleLogout = () => {
        authService.logout();
        globalThis.location.href = '/login';
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        form.setFieldsValue({
            ...task,
            dueDate: task.dueDate ? moment(task.dueDate) : null
        });
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status === 'PENDING' && <ClockCircleOutlined />}
                    {status === 'IN_PROGRESS' && <ClockCircleOutlined />}
                    {status === 'COMPLETED' && <CheckCircleOutlined />}
                    {' '}{status}
                </Tag>
            ),
        },
        {
            title: 'Приоритет',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <Tag color={
                    priority === 'HIGH' ? 'red' :
                        priority === 'MEDIUM' ? 'orange' : 'green'
                }>
                    {priority}
                </Tag>
            ),
        },
        {
            title: 'Срок',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Редактировать
                    </Button>
                    <Popconfirm
                        title="Удалить задачу?"
                        onConfirm={() => handleDelete(record.id)}
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

    const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
    const pendingTasks = tasks.filter(task => task.status === 'PENDING').length;

    return (
        <Layout className="dashboard-layout">
            <Header className="dashboard-header">
                <div className="header-content">
                    <h1>Task Manager</h1>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Выйти
                    </Button>
                </div>
            </Header>

            <Content className="dashboard-content">
                <div className="dashboard-container">
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Всего задач"
                                    value={tasks.length}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Выполнено"
                                    value={completedTasks}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="В ожидании"
                                    value={pendingTasks}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Панель управления */}
                    <Card
                        title="Задачи"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditingTask(null);
                                    form.resetFields();
                                    setModalVisible(true);
                                }}
                            >
                                Новая задача
                            </Button>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={tasks}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>

                    {/* Модалка создания/редактирования задачи */}
                    <Modal
                        title={editingTask ? 'Редактировать задачу' : 'Новая задача'}
                        open={modalVisible}
                        onCancel={() => {
                            setModalVisible(false);
                            setEditingTask(null);
                            form.resetFields();
                        }}
                        footer={null}
                        width={600}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                name="title"
                                label="Название"
                                rules={[{ required: true, message: 'Введите название задачи' }]}
                            >
                                <Input placeholder="Введите название задачи" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Описание"
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Введите описание задачи"
                                />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Статус"
                                rules={[{ required: true, message: 'Выберите статус' }]}
                            >
                                <Select placeholder="Выберите статус">
                                    <Option value="PENDING">В ожидании</Option>
                                    <Option value="IN_PROGRESS">В работе</Option>
                                    <Option value="COMPLETED">Выполнено</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="priority"
                                label="Приоритет"
                                rules={[{ required: true, message: 'Выберите приоритет' }]}
                            >
                                <Select placeholder="Выберите приоритет">
                                    <Option value="LOW">Низкий</Option>
                                    <Option value="MEDIUM">Средний</Option>
                                    <Option value="HIGH">Высокий</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="dueDate"
                                label="Срок выполнения"
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD.MM.YYYY"
                                />
                            </Form.Item>

                            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                                <Space>
                                    <Button
                                        onClick={() => {
                                            setModalVisible(false);
                                            setEditingTask(null);
                                            form.resetFields();
                                        }}
                                    >
                                        Отмена
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingTask ? 'Обновить' : 'Создать'}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
};

export default Dashboard;