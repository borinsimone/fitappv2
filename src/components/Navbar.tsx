import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BiDumbbell, BiHomeAlt, BiUser } from 'react-icons/bi';
import { FaAppleAlt } from 'react-icons/fa';

import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  let base = '/fitappv2';
  const location = useLocation();
  const [indicatorX, setIndicatorX] = useState(0);
  const iconRefs = useRef<Array<HTMLLIElement | null>>([]);
  const routes = ['/home', '/workout-planner', '/meal-planner', '/account'];

  useEffect(() => {
    const index = routes.indexOf(location.pathname);
    if (index !== -1 && iconRefs.current[index]) {
      const iconPosition = iconRefs.current[index]?.offsetLeft || 0;
      setIndicatorX(iconPosition);
    }
  }, [location.pathname]);

  return (
    <Container
      as={motion.nav}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      hidden={
        location.pathname === '/login' || location.pathname === '/register'
      }
    >
      <Indicator style={{ left: indicatorX + 'px' }} />
      <ul>
        {routes.map((path, index) => (
          <li
            key={path}
            ref={(el) => {
              iconRefs.current[index] = el;
            }}
          >
            <Link to={path}>
              {index === 0 && (
                <BiHomeAlt
                  size='30px'
                  style={{ transition: '300ms', transitionDelay: '400ms' }}
                  color={location.pathname === '/home' ? '#1e1e1e' : '#d0d0d0'}
                />
              )}
              {index === 1 && (
                <BiDumbbell
                  className='dumbbell'
                  size='30px'
                  style={{ transition: '300ms', transitionDelay: '400ms' }}
                  color={
                    location.pathname === '/workout-planner'
                      ? '#1e1e1e'
                      : '#d0d0d0'
                  }
                />
              )}
              {index === 2 && (
                <FaAppleAlt
                  size='30px'
                  style={{ transition: '300ms', transitionDelay: '400ms' }}
                  color={
                    location.pathname === '/meal-planner'
                      ? '#1e1e1e'
                      : '#d0d0d0'
                  }
                />
              )}
              {index === 3 && (
                <BiUser
                  size='30px'
                  style={{ transition: '300ms', transitionDelay: '400ms' }}
                  color={
                    location.pathname === '/account' ? '#1e1e1e' : '#d0d0d0'
                  }
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default Navbar;
const Container = styled.nav`
  position: fixed;
  width: 100%;
  bottom: 20px;
  z-index: 10;
  display: ${(props) => (props.hidden ? 'none' : 'flex')};

  align-items: center;
  justify-content: center;

  ul {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px 0;
    background-color: ${({ theme }) => theme.colors.white10};
    border-radius: 100px;
    width: 90%;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        display: grid;
        place-content: center;
        z-index: 100;
      }
      .dumbbell {
        transform: rotate(-45deg);
      }
    }
  }
`;
const Indicator = styled.div`
  position: absolute;
  bottom: 5px;
  width: 60px;
  height: 40px;
  background: linear-gradient(180deg, #00736e, #00c6be);
  border-radius: 25px;
  transition: left 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: translateX(-25%);
`;
