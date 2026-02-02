import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types/AuthenticationTypes';

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });


    const login = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        window.dispatchEvent(new Event('auth-change'));
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('auth-change'));
    };

    const isAuthenticated = !!user;

    const hasRole = (roles: UserRole[]) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
