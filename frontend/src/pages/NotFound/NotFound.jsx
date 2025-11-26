import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <Result
                status="404"
                title="404"
                subTitle="Извините, страница не найдена."
                extra={
                    <Link to="/">
                        <Button type="primary">
                            Вернуться на главную
                        </Button>
                    </Link>
                }
            />
        </div>
    );
};

export default NotFound;