import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BiLock, BiLogIn, BiEnvelope } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';

import { useGlobalContext } from '../../context/GlobalContext';
import { login } from '../../service/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { setToken } = useAuth();
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
      localStorage.setItem('token', response.token);
      setToken(response.token);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackgroundGlow />

      <ContentContainer
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <LogoWrapper>
            <Logo>FitApp</Logo>
            <LogoTagline>Arriva al tuo prime</LogoTagline>
          </LogoWrapper>
        </LogoSection>

        <FormSection>
          <FormHeader>
            <FormTitle>Bentornato</FormTitle>
            <FormSubtitle>Accedi al tuo account per continuare</FormSubtitle>
          </FormHeader>

          <LoginForm onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon>
                <BiEnvelope />
              </InputIcon>
              <StyledInput
                type='email'
                placeholder='Email Address'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <BiLock />
              </InputIcon>
              <StyledInput
                type='password'
                placeholder='Password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>

            <ForgotPassword to='/forgot-password'>
              Forgot password?
            </ForgotPassword>

            <LoginButton
              type='submit'
              disabled={isLoading}
              as={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <BiLogIn size={20} />
                  Sign In
                </>
              )}
            </LoginButton>
          </LoginForm>

          <Divider>
            <DividerLine />
            <DividerText>oppure</DividerText>
            <DividerLine />
          </Divider>

          <SocialButton
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FcGoogle size={20} />
            Google
          </SocialButton>

          <SignupPrompt>
            Non hai un account?{' '}
            <Link
              to='/register'
              // as={motion.Link}
              // whileHover={{ color: '#00c6be' }}
            >
              Registrati
            </Link>
          </SignupPrompt>
        </FormSection>
      </ContentContainer>
    </Container>
  );
};

export default Login;

// Styled Components
const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.dark};
  position: relative;
  overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.6;
  }

  &::before {
    background: ${({ theme }) => theme.colors.neon};
    top: -100px;
    right: -100px;
    animation: float 8s ease-in-out infinite alternate;
  }

  &::after {
    background: ${({ theme }) => theme.colors.neon};
    bottom: -100px;
    left: -100px;
    animation: float 10s ease-in-out infinite alternate-reverse;
  }

  @keyframes float {
    0% {
      transform: translate(0, 0) scale(1);
    }
    100% {
      transform: translate(50px, 50px) scale(1.2);
    }
  }
`;

const ContentContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 400px;
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
`;

const LogoSection = styled.div`
  padding: 30px 0;
  display: flex;
  justify-content: center;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.neon}90, ${theme.colors.neon}40)`};
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  margin: 0;
`;

const LogoTagline = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0;
`;

const FormSection = styled.div`
  padding: 30px;
`;

const FormHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
  margin: 0 0 8px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white70};
  margin: 0;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.colors.white50};
  font-size: 18px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 48px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.white40};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.neon}30`};
  }
`;

const ForgotPassword = styled(Link)`
  align-self: flex-end;
  color: ${({ theme }) => theme.colors.white70};
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.neon};
  }
`;

const LoginButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  margin-top: 16px;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${({ theme }) => theme.colors.dark};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${({ theme }) => theme.colors.white20};
`;

const DividerText = styled.span`
  padding: 0 16px;
  color: ${({ theme }) => theme.colors.white50};
  font-size: 14px;
`;

const SocialButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const SignupPrompt = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.white70};
  font-size: 14px;
  margin: 24px 0 0;
`;

const SignupLink = styled(Link)`
  color: ${({ theme }) => theme.colors.neon};
  font-weight: 600;
  text-decoration: none;
`;
