import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

function Widget({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Container>
      <div className='title'>{title}</div>
      <div className='content'>{children}</div>
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
  }
  .content {
  }
`;
