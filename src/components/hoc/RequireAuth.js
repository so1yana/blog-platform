import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
    const { token } = useSelector((state) => state.userData);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}
