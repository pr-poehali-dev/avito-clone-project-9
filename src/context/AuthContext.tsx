import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city: string;
  balance: number;
  verified: boolean;
  avatar: string;
  adsCount: number;
  rating: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

interface RegisterData {
  name: string;
  identifier: string; // phone or email
  password: string;
  city: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: User = {
  id: "u1",
  name: "Александр Петров",
  phone: "+7 (999) 123-45-67",
  email: "alex.petrov@mail.ru",
  city: "Москва",
  balance: 240,
  verified: true,
  avatar: "А",
  adsCount: 12,
  rating: 4.8,
  createdAt: "2023",
};

const STORAGE_KEY = "lavka_user";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(u: User | null) {
  if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  const login = async (identifier: string, password: string) => {
    // Demo: any password works for demo credentials
    if (
      (identifier === "demo" || identifier === "+7 (999) 123-45-67" || identifier === "alex.petrov@mail.ru") &&
      password.length >= 6
    ) {
      saveUser(DEMO_USER);
      setUser(DEMO_USER);
      return { ok: true };
    }
    // For any other credentials with valid format — create a new user session
    if (identifier.length >= 6 && password.length >= 6) {
      const isPhone = /^[\d\s+\-()]{10,}$/.test(identifier);
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: "Пользователь",
        phone: isPhone ? identifier : undefined,
        email: !isPhone ? identifier : undefined,
        city: "Москва",
        balance: 0,
        verified: false,
        avatar: identifier[0]?.toUpperCase() || "П",
        adsCount: 0,
        rating: 5.0,
        createdAt: new Date().getFullYear().toString(),
      };
      saveUser(newUser);
      setUser(newUser);
      return { ok: true };
    }
    return { ok: false, error: "Неверный логин или пароль" };
  };

  const register = async ({ name, identifier, password, city }: RegisterData) => {
    if (!name.trim()) return { ok: false, error: "Введите имя" };
    if (identifier.length < 6) return { ok: false, error: "Укажите телефон или email" };
    if (password.length < 6) return { ok: false, error: "Пароль минимум 6 символов" };

    const isPhone = /^[\d\s+\-()]{10,}$/.test(identifier);
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      phone: isPhone ? identifier : undefined,
      email: !isPhone ? identifier : undefined,
      city,
      balance: 100, // welcome bonus
      verified: false,
      avatar: name[0]?.toUpperCase() || "П",
      adsCount: 0,
      rating: 5.0,
      createdAt: new Date().getFullYear().toString(),
    };
    saveUser(newUser);
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => {
    saveUser(null);
    setUser(null);
  };

  const updateBalance = (amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, balance: prev.balance + amount };
      saveUser(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}