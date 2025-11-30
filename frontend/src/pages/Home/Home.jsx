import { Button, Card, Row, Col, Typography, Space, Divider, Tag } from 'antd';
import {
  CheckCircleOutlined,
  TeamOutlined,
  RocketOutlined,
  LockOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Home.css';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const features = [
    {
      icon: <CheckCircleOutlined />,
      title: 'Управление задачами',
      description: 'Создавайте, редактируйте и отслеживайте задачи в удобном интерфейсе'
    },
    {
      icon: <TeamOutlined />,
      title: 'Простая коллаборация',
      description: 'Идеально для личного использования и небольших команд'
    },
    {
      icon: <RocketOutlined />,
      title: 'Высокая производительность',
      description: 'Быстрое React приложение с современным дизайном'
    },
    {
      icon: <LockOutlined />,
      title: 'Безопасность',
      description: 'Надежная аутентификация и защита данных'
    }
  ];

  const technologies = [
    { name: 'React', color: 'blue' },
    { name: 'Spring Boot', color: 'green' },
    { name: 'PostgreSQL', color: 'volcano' },
    { name: 'Docker', color: 'cyan' },
    { name: 'Ant Design', color: 'geekblue' }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Task Manager
          </Title>
          <Title level={3} className="hero-subtitle">
            Простое и эффективное управление вашими задачами
          </Title>
          <Paragraph className="hero-description">
            Современное веб-приложение для организации работы.
            Создавайте задачи, отслеживайте прогресс и повышайте свою продуктивность.
          </Paragraph>

          <Space size="large" className="hero-actions">
            <Link to="/register">
              <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                Начать
              </Button>
            </Link>
            <Link to="/login">
              <Button size="large" icon={<ArrowRightOutlined />}>
                Войти в аккаунт
              </Button>
            </Link>
          </Space>

          <div className="tech-stack">
            <Text strong>Технологии: </Text>
            <Space size="small" wrap>
              {technologies.map((tech) => (
                <Tag key={tech.id} color={tech.color}>
                  {tech.name}
                </Tag>
              ))}
            </Space>
          </div>
        </div>

        <div className="hero-visual">
          <div className="task-card-preview">
            <div className="preview-header">
              <Text strong>Мои задачи</Text>
            </div>
            <div className="preview-content">
              {['Завершить проект', 'Подготовить отчет', 'Изучить новые технологии'].map((task) => (
                <div key={task.id} className="preview-task">
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>{task}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section className="features-section">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
          Почему Task Manager?
        </Title>

        <Row gutter={[32, 32]}>
          {features.map((feature) => (
            <Col xs={24} md={12} lg={6} key={feature.id}>
              <Card
                className="feature-card"
                hoverable
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <Divider />

      <section className="cta-section">
        <Card className="cta-card">
          <div className="cta-content">
            <Title level={2}>Готовы начать?</Title>
            <Paragraph>
              Присоединяйтесь пользователям, которые уже повысили
              свою продуктивность с помощью Task Manager
            </Paragraph>
            <Link to="/register">
              <Button type="primary" size="large">
                Создать аккаунт
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <footer className="home-footer">
        <Paragraph type="secondary">
          © 2025 Task Manager. Все права защищены.
        </Paragraph>
      </footer>
    </div>
  );
};

export default Home;