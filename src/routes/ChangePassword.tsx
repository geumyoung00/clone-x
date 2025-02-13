import { useState } from 'react';
import { Button, Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import { styled } from 'styled-components';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';

const Text = styled.span`
  margin-top: 30px;
`;

export default function ChangePassword() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isLoading || email === '') return;

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert(`Email sent! Please check your inbox. \nIf you don’t see it, verify your email address and try again.`);
      navigate('/signin', { replace: true });
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Change password</Title>
      <Text>Please enter your registered email address.</Text>
      <Form onSubmit={onSubmit}>
        <Input name='email' value={email} placeholder='Email' type='text' autoComplete='email' onChange={onChange} />
        <Button>{isLoading ? 'Loading...' : 'Send Email for Change password'}</Button>
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't you have account? <Link to='/signup'>Sign up &rarr;</Link>
      </Switcher>
      <Switcher>
        Don't you want change password? <Link to='/resetpw'>sign in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
