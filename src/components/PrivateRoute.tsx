import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) {
    return <div><LoadingComponent/></div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole ?? "")) {
    return <Navigate to="/not-authorized" />;
  }
   
  return <>{children}</>;
};

export default PrivateRoute;
