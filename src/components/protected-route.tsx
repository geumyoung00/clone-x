import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // ✅ navigate()를 useEffect 내부에서 실행해야 함
      if (!firebaseUser) {
        navigate('/signin', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return null; // 리디렉트 전에 깜빡이는 UI 방지
  }

  return <>{children}</>;
}
