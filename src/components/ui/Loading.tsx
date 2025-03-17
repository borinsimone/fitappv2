import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
  return (
    <LoadingWrapper
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* <Spinner /> */}
      <DotLottieReact
        src='https://lottie.host/ec5885c9-beaa-463f-be66-6eae15783f97/XhWvMVgadE.lottie'
        loop
        autoplay
        className='loader'
      />
    </LoadingWrapper>
  );
};

export default Loading;
const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.dark}60`};
  z-index: 9999;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  .loader {
    height: 150px;
  }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
