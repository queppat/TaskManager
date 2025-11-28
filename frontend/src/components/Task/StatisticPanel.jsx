import { Card, Statistic, Row, Col } from 'antd';
import PropTypes from 'prop-types';

const StatsPanel = ({
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks
}) => {
    return (
        <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Всего задач"
                        value={totalTasks}
                        styles={{
                            content: {
                                color: '#1890ff'
                            }
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Выполнено"
                        value={completedTasks}
                        styles={{
                            content: {
                                color: '#52c41a'
                            }
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="В работе"
                        value={inProgressTasks}
                        styles={{
                            content: {
                                color: '#faad14'
                            }
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="В ожидании"
                        value={pendingTasks}
                        styles={{
                            content: {
                                color: '#ff4d4f'
                            }
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

StatsPanel.propTypes = {
    totalTasks: PropTypes.number.isRequired,
    completedTasks: PropTypes.number.isRequired,
    pendingTasks: PropTypes.number.isRequired,
    inProgressTasks: PropTypes.number.isRequired,
};

export default StatsPanel;