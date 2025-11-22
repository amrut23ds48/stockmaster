import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react"; // ✅ type-only import
import React from "react";
export type UserRole = "manager" | "staff";

interface User {
  email: string;
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string, role: UserRole) => void;
  logout: () => void;
  isManager: () => boolean;
  isStaff: () => boolean;
  hasPermission: (permission: Permission) => boolean;
}

export enum Permission {
  CREATE_PRODUCT = "create_product",
  UPDATE_PRODUCT = "update_product",
  DELETE_PRODUCT = "delete_product",
  VIEW_PRODUCT = "view_product",

  CREATE_RECEIPT = "create_receipt",
  UPDATE_RECEIPT = "update_receipt",
  DELETE_RECEIPT = "delete_receipt",
  VIEW_RECEIPT = "view_receipt",
  VALIDATE_RECEIPT = "validate_receipt",

  CREATE_DELIVERY = "create_delivery",
  UPDATE_DELIVERY = "update_delivery",
  DELETE_DELIVERY = "delete_delivery",
  VIEW_DELIVERY = "view_delivery",
  VALIDATE_DELIVERY = "validate_delivery",

  UPDATE_STOCK = "update_stock",
  VIEW_STOCK = "view_stock",
  ADJUST_STOCK = "adjust_stock",

  CREATE_MOVEMENT = "create_movement",
  UPDATE_MOVEMENT_STATUS = "update_movement_status",
  UPDATE_MOVEMENT_DETAILS = "update_movement_details",
  DELETE_MOVEMENT = "delete_movement",
  VIEW_MOVEMENT = "view_movement",

  CREATE_WAREHOUSE = "create_warehouse",
  UPDATE_WAREHOUSE = "update_warehouse",
  DELETE_WAREHOUSE = "delete_warehouse",
  VIEW_WAREHOUSE = "view_warehouse",

  CREATE_LOCATION = "create_location",
  UPDATE_LOCATION = "update_location",
  DELETE_LOCATION = "delete_location",
  VIEW_LOCATION = "view_location",
}

const rolePermissions: Record<UserRole, Permission[]> = {
  manager: Object.values(Permission), // ✅ full access
  staff: [
    Permission.VIEW_PRODUCT,
    Permission.CREATE_RECEIPT,
    Permission.VIEW_RECEIPT,
    Permission.CREATE_DELIVERY,
    Permission.VIEW_DELIVERY,
    Permission.VIEW_STOCK,
    Permission.UPDATE_MOVEMENT_STATUS,
    Permission.VIEW_MOVEMENT,
    Permission.VIEW_WAREHOUSE,
    Permission.VIEW_LOCATION,
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children?: ReactNode; // ✅ FIX — now optional
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole") as UserRole;

    if (storedAuth === "true" && storedEmail && storedName && storedRole) {
      setUser({
        email: storedEmail,
        name: storedName,
        role: storedRole,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (email: string, name: string, role: UserRole) => {
    const newUser = { email, name, role, isAuthenticated: true };

    setUser(newUser);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  const isManager = () => user?.role === "manager";
  const isStaff = () => user?.role === "staff";

  const hasPermission = (permission: Permission) =>
    user ? rolePermissions[user.role].includes(permission) : false;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isManager, isStaff, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
