import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Input from '../../components/Input';
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
  };
  return (
    <Container>
      <div className='decoration'></div>
      <div className='decoration'></div>
      <div className='decoration'></div>
      <div className='formContainer'>
        <h1>Registrati</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type='name'
            placeholder='Nome'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type='email'
            placeholder='Email/Telefono'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type='submit'>Registrati</Button>
        </form>
        <div className='or'>
          <div className='line'></div>
          oppure
          <div className='line'></div>
        </div>
        <Link
          to='/login'
          className='new'
        >
          Accedi
        </Link>
      </div>
    </Container>
  );
}

export default Register;
const Container = styled.div`
  height: 100vh;
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
      font-weight: 300;

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
