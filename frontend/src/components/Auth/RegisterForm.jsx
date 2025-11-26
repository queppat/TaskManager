import { Form, Input, Button, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RegisterForm = ({ onRegister, loading = false }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        await onRegister(values);
    };

    return (
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
        >
            <Form.Item
                name="username"
                label="Имя пользователя"
                rules={[
                    { required: true, message: 'Пожалуйста, введите ваше имя!' },
                    { min: 2, message: 'Имя должно содержать минимум 2 символа!' }
                ]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="username"
                />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Пожалуйста, введите ваш email!' },
                    { type: 'email', message: 'Неверный формат email!' }
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="example@mail.com"
                />
            </Form.Item>

            <Form.Item
                name="password"
                label="Пароль"
                rules={[
                    { required: true, message: 'Пожалуйста, введите пароль!' },
                    { min: 6, message: 'Пароль должен содержать минимум 6 символов!' }
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Пароль"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                label="Подтверждение пароля"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Пожалуйста, подтвердите пароль!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли не совпадают!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Подтвердите пароль"
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                >
                    Зарегистрироваться
                </Button>
            </Form.Item>

            <Divider>или</Divider>
            <div style={{ textAlign: 'center' }}>
                <span>Создали аккаунт? </span>
                <Link to="/login" style={{ fontWeight: 500 }}>
                    Войти
                </Link>
            </div>

        </Form>
    );
};

export default RegisterForm;

RegisterForm.propTypes = {
    onRegister: PropTypes.node.isRequired
};

RegisterForm.propTypes = {
    loading: PropTypes.node.isRequired
};