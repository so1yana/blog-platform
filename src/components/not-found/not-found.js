import { useNavigate } from 'react-router-dom';
import Button from '../button';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div style={{ marginTop: 96, display: 'flex', justifyContent: 'center' }}>
            <Button
                style={{ marginRight: 16, width: 30 }}
                onClick={() => navigate(-1, { replace: true })}
            >
                {'<-'}
            </Button>
            <h2>Page doesn`t exist!</h2>
        </div>
    );
}
