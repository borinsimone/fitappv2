import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'disabled';
  type?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const StyledButton = styled.button<ButtonProps>`
  padding: 13px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.neon};
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
  &:hover {
    opacity: ${({ variant }) => (variant === 'disabled' ? '1' : '0.8')};
  }
`;

const Button = ({
  children,
  variant = 'primary',
  type,
  className,
  onClick,
  ...props
}: ButtonProps & { children: React.ReactNode }) => {
  return (
    <StyledButton
      variant={variant}
      type={type}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
