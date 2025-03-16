import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

function NotificationPanel() {
  return (
    <Container
      as={motion.div}
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.2 }}
    >
      NotificationPanel
    </Container>
  );
}

export default NotificationPanel;
const Container = styled.div`
  position: absolute;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.white10};
  width: calc(100vw - 40px);
  height: 80vh;
  height: 80dvh;
  right: 0;
  border-radius: 20px;
  padding: 20px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
`;
