import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  BiUser,
  BiLock,
  BiEnvelope,
  BiUserPlus,
} from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { useGlobalContext } from "../../context/GlobalContext";
import { register } from "../../service/authService";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const { isLoading, setIsLoading } = useGlobalContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Send only required fields to backend
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      console.log("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
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
            <LogoTagline>Your Fitness Journey</LogoTagline>
          </LogoWrapper>
        </LogoSection>

        <FormSection>
          <FormHeader>
            <FormTitle>Create Account</FormTitle>
            <FormSubtitle>
              Join us and start your fitness journey
            </FormSubtitle>
          </FormHeader>

          <SignupForm onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon>
                <BiUser />
              </InputIcon>
              <StyledInput
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                required
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <BiEnvelope />
              </InputIcon>
              <StyledInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                required
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <BiLock />
              </InputIcon>
              <StyledInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                required
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <BiLock />
              </InputIcon>
              <StyledInput
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                required
                onChange={handleChange}
              />
            </InputGroup>

            <TermsCheckbox>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the{" "}
                <TermsLink>Terms & Conditions</TermsLink>
              </label>
            </TermsCheckbox>

            <RegisterButton
              type="submit"
              disabled={isLoading}
              as={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <BiUserPlus size={20} />
                  Create Account
                </>
              )}
            </RegisterButton>
          </SignupForm>

          <Divider>
            <DividerLine />
            <DividerText>or sign up with</DividerText>
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

          <LoginPrompt>
            Already have an account?{" "}
            <Link
              to="/login"
              // as={motion.a}
              // whileHover={{ color: '#00c6be' }}
            >
              Sign in
            </Link>
          </LoginPrompt>
        </FormSection>
      </ContentContainer>
    </Container>
  );
}

export default Register;

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
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.7;
  }

  &::before {
    background: ${({ theme }) => theme.colors.neon};
    top: -150px;
    right: -150px;
    animation: float1 6s ease-in-out infinite alternate;
  }

  &::after {
    background: ${({ theme }) => theme.colors.neon};
    bottom: -150px;
    left: -150px;
    animation: float2 7s ease-in-out infinite
      alternate-reverse;
  }

  @keyframes float1 {
    0% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(100px, -50px) scale(1.5);
    }
    100% {
      transform: translate(-50px, 100px) scale(1.3);
    }
  }

  @keyframes float2 {
    0% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(-100px, 50px) scale(1.5);
    }
    100% {
      transform: translate(50px, -100px) scale(1.3);
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
  padding: 10px 30px;
`;

const FormHeader = styled.div`
  margin-bottom: 14px;
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

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    box-shadow: 0 0 0 2px
      ${({ theme }) => `${theme.colors.neon}30`};
  }
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white70};

  input {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.neon};
  }
`;

const TermsLink = styled.span`
  color: ${({ theme }) => theme.colors.neon};
  cursor: pointer;
`;

const RegisterButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  margin-top: 8px;
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
  margin: 10px 0;
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

const LoginPrompt = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.white70};
  font-size: 14px;
  margin: 14px 0 0;
`;
