import { motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BiDumbbell,
  BiHomeAlt,
  BiUser,
} from "react-icons/bi";
import { FaAppleAlt } from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  const location = useLocation();
  const [indicatorX, setIndicatorX] = useState(0);
  const iconRefs = useRef<Array<HTMLLIElement | null>>([]);
  const routes = useMemo(
    () => [
      "/home",
      "/workout-planner",
      "/meal-planner",
      "/account",
    ],
    []
  );

  const updateIndicator = () => {
    const index = routes.findIndex((route) =>
      location.pathname.startsWith(route)
    );
    if (index !== -1 && iconRefs.current[index]) {
      const el = iconRefs.current[index];
      if (el) {
        // Center the indicator: element center - half indicator width (30px)
        const newX =
          el.offsetLeft + el.offsetWidth / 2 - 30;
        setIndicatorX(newX);
      }
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () =>
      window.removeEventListener("resize", updateIndicator);
  }, [location.pathname, routes]);

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <Container
      as={motion.nav}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      $hidden={
        location.pathname === "/login" ||
        location.pathname === "/register"
      }
    >
      <Indicator style={{ left: indicatorX + "px" }} />
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
                  size="30px"
                  style={{
                    transition: "300ms",
                    transitionDelay: "400ms",
                  }}
                  color={
                    isActive(path) ? "#1e1e1e" : "#d0d0d0"
                  }
                />
              )}
              {index === 1 && (
                <BiDumbbell
                  className="dumbbell"
                  size="30px"
                  style={{
                    transition: "300ms",
                    transitionDelay: "400ms",
                  }}
                  color={
                    isActive(path) ? "#1e1e1e" : "#d0d0d0"
                  }
                />
              )}
              {index === 2 && (
                <FaAppleAlt
                  size="30px"
                  style={{
                    transition: "300ms",
                    transitionDelay: "400ms",
                  }}
                  color={
                    isActive(path) ? "#1e1e1e" : "#d0d0d0"
                  }
                />
              )}
              {index === 3 && (
                <BiUser
                  size="30px"
                  style={{
                    transition: "300ms",
                    transitionDelay: "400ms",
                  }}
                  color={
                    isActive(path) ? "#1e1e1e" : "#d0d0d0"
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
const Container = styled.nav<{ $hidden?: boolean }>`
  position: fixed;
  width: 100%;
  height: 10vh;
  /* bottom: 20px; */
  bottom: 0;
  z-index: 1001;
  display: ${(props) => (props.$hidden ? "none" : "flex")};

  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.dark};

  ul {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px 0;
    /* background-color: ${({ theme }) =>
      theme.colors.white10}; */
    border-radius: 100px;
    width: 100%;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px; /* Ensure consistent width for centering */
      a {
        display: grid;
        place-content: center;
        z-index: 100;
        width: 100%;
        height: 100%;
      }
      .dumbbell {
        transform: rotate(-45deg);
      }
    }
  }
`;
const Indicator = styled.div`
  position: absolute;
  /* bottom: 5px; */
  width: 60px;
  height: 40px;
  background: linear-gradient(180deg, #00736e, #00c6be);
  border-radius: 25px;
  transition: left 0.3s ease-in-out;
  /* transform removed as we calculate exact center */
`;
