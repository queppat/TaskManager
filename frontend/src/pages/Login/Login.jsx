import { useState } from 'react';
import { message, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import LoginForm from '../../components/Auth/LoginForm';
import './Login.css';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleLogin = async (formData) => {
        setLoading(true);
        try {
            await authService.login(formData);
            messageApi.success('Вход в аккаунт произошел успешно!');

            setTimeout(() => {
                globalThis.location.href = '/dashboard';
            }, 1000);
        } catch (error) {
            messageApi.error(error.response?.data?.message || 'Ошибка аутентификации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {contextHolder}
            <Card className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <UserOutlined />
                    </div>
                    <h1 className="login-title">Вход в аккаунт</h1>
                    <p className="login-subtitle">Введите ваши учетные данные</p>
                </div>

                <LoginForm
                    onLogin={handleLogin}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default LoginPage;