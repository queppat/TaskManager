import { Modal, Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { PropTypes } from 'prop-types'
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const TaskModal = ({
    visible,
    editingTask,
    onCancel,
    onFinish,
    form
}) => {
    return (
        <Modal
            title={editingTask ? 'Редактировать задачу' : 'Новая задача'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
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
                    rules={[{ max: 255, message: 'Описание не может быть больше 255 символов' }]}
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
                        <Option value="TODO">Сделать</Option>
                        <Option value="IN_PROGRESS">В процессе</Option>
                        <Option value="DONE">Выполнено</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="deadline"
                    label="Срок выполнения"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, выберите срок выполнения',
                        },
                        {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.resolve();
                                }

                                const selectedDate = value.toDate();
                                const now = new Date();

                                const nowWithBuffer = new Date(now.getTime() - 60000);

                                if (selectedDate < nowWithBuffer) {
                                    return Promise.reject(new Error('Дата и время должны быть не раньше текущего момента'));
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="DD.MM.YYYY HH:mm"
                        showTime={{
                            format: 'HH:mm',
                        }}
                        disabledDate={(current) => {

                            return current && current < dayjs().startOf('day');
                        }}
                    />
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                    <Space>
                        <Button onClick={onCancel}>
                            Отмена
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingTask ? 'Обновить' : 'Создать'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskModal;

TaskModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    editingTask: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        status: PropTypes.oneOf(['TODO', 'IN_PROGRESS', 'DONE']),
        deadline: PropTypes.string
    }),
    onCancel: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired
};

TaskModal.defaultProps = {
    editingTask: null
};