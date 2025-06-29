import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configurar o interceptor do axios para incluir o token em todas as requisições
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  useEffect(() => {
    // Verificar se o usuário está logado verificando o token no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUser(decodedToken);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await axios.post('/auth/login', { email, senha });
      if (response.status === 200) {
        // O token já está nos cookies automaticamente
        // Também vamos salvar no localStorage para referência
        localStorage.setItem('token', response.data);
        // Decodificar o token para obter as informações do usuário
        const decodedToken = decodeToken(response.data);
        if (decodedToken) {
          setUser(decodedToken);
          return true;
        }
        throw new Error('Erro ao decodificar token');
      }
    } catch (error) {
      throw new Error(error.response?.data?.mensagem || 'Erro ao fazer login');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/usuarios', userData);
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      throw new Error(error.response?.data?.mensagem || 'Erro ao criar conta');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 