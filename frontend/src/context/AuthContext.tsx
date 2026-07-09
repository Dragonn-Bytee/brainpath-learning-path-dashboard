import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (e: string, p: string) => Promise<void>;
    register: (n: string, e: string, p: string) => Promise<void>;
    googleLogin: (n?: string, e?: string, a?: string, googleId?: string, credential?: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (e: string, p: string) => {
        const res = await apiLogin(e, p);
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
    };

    const register = async (n: string, e: string, p: string) => {
        const res = await apiRegister(n, e, p);
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
    };

    const googleLogin = async (n?: string, e?: string, a?: string, googleId?: string, credential?: string) => {
        console.log('AuthContext googleLogin called:', { n, e, a, googleId, credential });
        const res = await apiGoogleLogin(n, e, a, googleId, credential);
        console.log('AuthContext googleLogin response:', res);
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, updateUser, loading }}>
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
