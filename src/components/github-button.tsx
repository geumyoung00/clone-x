import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { styled } from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
  background-color: white;
  font-weight: 600;
  padding: 10px 20px;
  margin-top: 50px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provieder = new GithubAuthProvider();
      await signInWithPopup(auth, provieder);
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src='/github-logo.svg' />
      Continue with Github
    </Button>
  );
}
