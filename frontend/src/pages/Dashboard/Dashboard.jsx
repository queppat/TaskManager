import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Layout, Card, Button, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { taskService } from '../../services/taskService';
import './Dashboard.css';
import StatsPanel from '../../components/Task/StatisticPanel';
import AppHeader from '../../components/Task/Header';
import TaskTable from '../../components/Task/TaskTable';
import TaskModal from '../../components/Task/TaskModal';
import TaskPagination from '../../components/Task/TaskPagination';
import dayjs from 'dayjs'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTaskFilters } from '../../hooks/useTasksFilter';
import TaskFilters from '../../components/Task/FilterSelection';

const { Content } = Layout;

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form] = Form.useForm();

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalTasks, setTotalTasks] = useState(0);

    const [completedTasks, setCompletedTasks] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [inProgressTasks, setInProgressTasks] = useState(0);

    const { filters, sort, handlers } = useTaskFilters();

    const filtersRef = useRef(filters);
    const sortRef = useRef(sort);

    useEffect(() => {
        filtersRef.current = filters;
        sortRef.current = sort;
    }, [filters, sort]);

    const updateTaskStats = useCallback((tasksList) => {
        const completed = tasksList.filter(task => task.status === 'DONE').length;
        const pending = tasksList.filter(task => task.status === 'TODO').length;
        const inProgress = tasksList.filter(task => task.status === 'IN_PROGRESS').length;

        setCompletedTasks(completed);
        setPendingTasks(pending);
        setInProgressTasks(inProgress);
    }, []);

    const loadTasks = useCallback(async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const tasksData = await taskService.getAllTasks(page, size, filters, sort);

            setTasks(tasksData.content);
            setTotalTasks(tasksData.totalElements);
            setCurrentPage(page);
            setPageSize(size);

            updateTaskStats(tasksData.content);
        } catch (error) {
            messageApi.error(error.response?.data?.message || 'Ошибка загрузки задач');
        } finally {
            setLoading(false);
        }
    }, [messageApi, filters, sort, updateTaskStats]);

    const handlePageChange = useCallback((page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        loadTasks(page, size);
    }, [loadTasks]);

    useEffect(() => {
        loadTasks(0, pageSize);
    }, [filters, sort, pageSize, loadTasks]);

    const handleSubmit = async (values) => {
        try {
            const dataToSend = {
                ...values,
                deadline: values.deadline ? values.deadline.format('YYYY-MM-DDTHH:mm:ss') : null
            };

            if (editingTask) {
                await taskService.updateTask(editingTask.id, dataToSend);
                messageApi.success('Задача обновлена');
            } else {
                await taskService.createTask(dataToSend);
                messageApi.success('Задача создана');
            }

            setModalVisible(false);
            setEditingTask(null);
            form.resetFields();
            loadTasks(currentPage, pageSize);
        } catch (error) {
            messageApi.error(error.response?.data?.message || 'Ошибка сохранения задачи');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            messageApi.success('Задача удалена');

            const isLastTaskOnPage = tasks.length === 1;
            const isNotFirstPage = currentPage > 0;

            if (isLastTaskOnPage && isNotFirstPage) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                loadTasks(previousPage, pageSize);
            } else {
                loadTasks(currentPage, pageSize);
            }
        } catch (error) {
            messageApi.error(error.response?.data?.message || 'Ошибка удаления задачи');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setViewMode(false);

        const formValues = {
            ...task,
            deadline: task.deadline ? dayjs(task.deadline) : null
        };

        form.setFieldsValue(formValues);
        setModalVisible(true);
    };

    const handleView = (task) => {
        setEditingTask(task);
        setViewMode(true);
        setModalVisible(true);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/login');
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingTask(null);
        setViewMode(false);
        form.resetFields();
    };

    const handleNewTask = () => {
        setEditingTask(null);
        form.resetFields();
        setModalVisible(true);
    };

    return (
        <Layout className="dashboard-layout">
            {contextHolder}
            <AppHeader onLogout={handleLogout} />

            <Content className="dashboard-content">
                <div className="dashboard-container">
                    <StatsPanel
                        totalTasks={totalTasks}
                        completedTasks={completedTasks}
                        pendingTasks={pendingTasks}
                        inProgressTasks={inProgressTasks}
                    />

                    <Card
                        title="Задачи"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNewTask}
                            >
                                Новая задача
                            </Button>
                        }
                    >
                        <TaskFilters
                            filters={filters}
                            sort={sort}
                            onSearch={handlers.handleSearch}
                            onStatusFilter={handlers.handleStatusFilter}
                            onDueDateFilter={handlers.handleDueDateFilter}
                            onSortChange={handlers.handleSortChange}
                            onResetFilters={handlers.handleResetFilters}
                            loading={loading}
                        />

                        <TaskTable
                            tasks={tasks}
                            loading={loading}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDelete}
                        />

                        <TaskPagination
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalTasks={totalTasks}
                            onPageChange={handlePageChange}
                        />
                    </Card>

                    <TaskModal
                        visible={modalVisible}
                        editingTask={editingTask}
                        onCancel={handleModalCancel}
                        viewMode={viewMode}
                        onFinish={handleSubmit}
                        form={form}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Dashboard;