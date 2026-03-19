import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector(store => store.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'hr') return <Navigate to="/hr/dashboard" replace />;
        return <Navigate to="/jobs" replace />;
    }

    return children;
};

export default ProtectedRoute;