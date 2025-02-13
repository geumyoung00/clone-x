import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Button, Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-button';

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isLoading || name === '' || email === '' || password === '') return;
    try {
      setIsLoading(true);
      //create an account.
      const credentials = await createUserWithEmailAndPassword(auth, email, password);

      // set the name of the user.
      await updateProfile(credentials.user, {
        displayName: name,
      });

      // redirect to the home page.
      navigate('/', { replace: true });
    } catch (e) {
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>🧡Join🧡</Title>
      <Form onSubmit={onSubmit}>
        <Input name='name' value={name} placeholder='Name' type='text' onChange={onChange} autoComplete='username' />
        <Input name='email' value={email} placeholder='Email' type='text' onChange={onChange} autoComplete='email' />
        <Input
          name='password'
          value={password}
          placeholder='Password'
          type='password'
          onChange={onChange}
          autoComplete={'current-password'}
        />
        <Button>{isLoading ? 'Loading...' : 'Create account'}</Button>
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an aacount? <Link to='/signin'>Sign in &rarr;</Link>
      </Switcher>
      <Switcher>
        Forgot your password? <Link to='/resetpw'>Change password &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
