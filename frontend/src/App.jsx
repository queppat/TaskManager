import { ConfigProvider } from 'antd';
import AppRouter from './routers/AppRouter';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;