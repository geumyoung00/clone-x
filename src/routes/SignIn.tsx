import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button, Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-button';

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const { value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isLoading || email === '' || password === '') return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/', { replace: true });
    } catch (e) {
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>🧡Sign in🧡</Title>
      <Form onSubmit={onSubmit}>
        <Input name='email' value={email} placeholder='Email' type='text' onChange={onChange} autoComplete='email' />
        <Input
          name='password'
          value={password}
          placeholder='Password'
          type='password'
          onChange={onChange}
          autoComplete={'current-password'}
        />
        <Button>{isLoading ? 'Loading...' : 'Sign in'}</Button>
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an aacount? <Link to='/signup'>Create on &rarr;</Link>
      </Switcher>
      <Switcher>
        Forgot your password? <Link to='/resetpw'>Change password &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
