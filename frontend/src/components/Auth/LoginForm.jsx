import { Form, Input, Button, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginForm = ({ onLogin, loading = false }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        await onLogin(values);
    };

    return (
        <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            initialValues={{ remember: true }}
        >
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
                rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Пароль"
                />
            </Form.Item>

            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Запомнить меня</Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                >
                    Войти
                </Button>
            </Form.Item>

            <Divider>или</Divider>
            <div style={{ textAlign: 'center' }}>
                <span>Нет аккаунта? </span>
                <Link to="/register" style={{ fontWeight: 500 }}>
                    Зарегистрироваться
                </Link>
            </div>
        </Form>
    );
};

export default LoginForm;

LoginForm.propTypes = {
    onLogin: PropTypes.node.isRequired
};

LoginForm.propTypes = {
    loading: PropTypes.node.isRequired
};