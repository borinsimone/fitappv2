import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import styled from "styled-components";

function Widget({
  children,
  index,
}: PropsWithChildren<{ index: number }>) {
  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.3 }}
    >
      {/* <div className='title'>{title}</div> */}
      <div className="content">{children}</div>
    </Container>
  );
}

export default Widget;
const Container = styled.div`
  .title {
    padding: 5px 0;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 700;
    position: sticky;
    top: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.dark};
    z-index: 10;
  }
  .content {
  }
`;
