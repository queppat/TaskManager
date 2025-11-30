import { useState } from 'react';
import { Card, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import RegisterForm from '../../components/Auth/RegisterForm';
import { authService } from '../../services/authService';
import './Register.css';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleRegister = async (formData) => {
        setLoading(true);
        try {
            await authService.register(formData);
            messageApi.success('Регистрация прошла успешно!');

            setTimeout(() => {
                globalThis.location.href = '/dashboard';
            }, 1000);
        } catch (error) {
            messageApi.error(error.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {contextHolder}
            <Card className="register-card">
                <div className="register-header">
                    <div className="register-icon">
                        <UserOutlined />
                    </div>
                    <h1 className="register-title">Регистрация</h1>
                    <p className="register-subtitle">Введите ваши учетные данные</p>
                </div>

                <RegisterForm
                    onRegister={handleRegister}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default RegisterPage;