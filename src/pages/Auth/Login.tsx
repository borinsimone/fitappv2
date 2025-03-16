import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useGlobalContext } from '../../context/GlobalContext';

import { login } from '../../service/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { token, setToken } = useAuth();
  const { isLoading, setIsLoading } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let credentials = { email, password };
    try {
      const response = await login(credentials);
      console.log('Logged in:', response);

      localStorage.setItem('token', response.token);
      setToken(response.token);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      alert('errore');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {isLoading && 'carico'}
      <div className='decoration'></div>
      <div className='decoration'></div>
      <div className='decoration'></div>
      <div className='formContainer'>
        <h1>Accedi</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type='email'
            placeholder='Email/Telefono'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className='forgot'>password dimenticata?</div>
          <Button type='submit'>Login</Button>
        </form>
        <div className='or'>
          <div className='line'></div>
          oppure
          <div className='line'></div>
        </div>
        <Link
          to='/register'
          className='new'
        >
          Crea un account
        </Link>
        <Link to='/home'>home</Link>
        <div
          onClick={() => {
            console.log(token);
          }}
        >
          test
        </div>
      </div>
    </Container>
  );
};

export default Login;
const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100%;
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  .decoration {
    background-color: ${({ theme }) => theme.colors.neon};
    height: 200px;
    aspect-ratio: 1;
    border-radius: 50%;
    -webkit-filter: blur(65px);
    filter: blur(65px);
    position: absolute;
    &:nth-child(1) {
      top: 0;
      right: 0;
      transform: translateY(-50%) translateX(50%);
    }
    &:nth-child(2) {
      left: 0;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
    &:nth-child(3) {
      bottom: 0;
      right: 0;
      transform: translate(30%, 10%);
    }
  }
  .formContainer {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 80%;
    min-height: 200px;
    max-width: 400px;
    background-color: #00000020;
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    padding: 20px;
    h1 {
      font-size: 24px;
      font-weight: 500;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .forgot {
        text-transform: capitalize;
        font-size: 14px;
      }
    }
    .or {
      display: flex;
      align-items: center;
      gap: 15px;

      .line {
        height: 1px;
        flex: 1;
        background-color: ${({ theme }) => theme.colors.white};
      }
    }
    .new {
      margin: 0 auto;
      font-weight: 700;
    }
  }
`;
