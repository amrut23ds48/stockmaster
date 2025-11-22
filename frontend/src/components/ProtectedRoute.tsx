import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
export function ProtectedRoute({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
