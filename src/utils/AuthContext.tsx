"use client";

import {
  createContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useContext,
  useEffect,
} from "react";

interface User {
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextHandler = ({ session }: { session: any }) => {
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (session?.user?.name) {
      setUser({ name: session.user.name });
    }
  }, [session, setUser]);

  return null;
};
