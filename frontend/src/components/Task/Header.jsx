import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { PropTypes } from 'prop-types'

const { Header } = Layout;

const AppHeader = ({ onLogout }) => {
    return (
        <Header className="dashboard-header">
            <div className="header-content">
                <h1>Task Manager</h1>
                <Button
                    type="primary"
                    danger
                    icon={<LogoutOutlined />}
                    onClick={onLogout}
                >
                    Выйти
                </Button>
            </div>
        </Header>
    );
};

export default AppHeader;

AppHeader.propTypes = {
    onLogout: PropTypes.func.isRequired,
};