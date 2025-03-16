import styled from 'styled-components';

const StyledInput = styled.input`
  background-color: #ffffff00;
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  color: ${({ theme }) => theme.colors.white};

  &:focus {
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
}

const Input = ({ type = 'text', placeholder, ...props }: InputProps) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
