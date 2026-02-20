import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireSeller?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  requireSeller = false,
  requireAdmin = false,
  redirectTo = "/seller/login",
}: ProtectedRouteProps) => {
  const { user, seller, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if ((requireSeller || requireAdmin) && !seller) {
    return <Navigate to="/seller/register" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
