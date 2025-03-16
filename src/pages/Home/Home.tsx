import { BiBadge, BiBadgeCheck, BiBell } from 'react-icons/bi';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import TopBar from './TopBar';
import { AnimatePresence, motion } from 'framer-motion';
import Widget from './Widget';
import { BsBadgeWc } from 'react-icons/bs';
import { LuBadge } from 'react-icons/lu';

function Home() {
  const { user, setUser } = useGlobalContext();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      setUser(decoded);
    }
  }, []);
  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <TopBar />

      <div className='widgetContainer'>
        <Widget title='traguardi'>
          <div className='achievement-container'>
            <div className='fade'></div>
            <div className='fade'></div>
            <div className='single-achievement'>
              <div className='badge-container'>
                <LuBadge
                  color='purple'
                  size='30px'
                />
              </div>
              <div className='name'>traguardo</div>
              <div className='details'>5/7 giorni</div>
            </div>
            <div className='single-achievement'>
              <div className='badge-container'>
                <LuBadge
                  color='purple'
                  size='30px'
                />
              </div>
              <div className='name'>traguardo</div>
              <div className='details'>5/7 giorni</div>
            </div>
            <div className='single-achievement'>
              <div className='badge-container'>
                <LuBadge
                  color='purple'
                  size='30px'
                />
              </div>
              <div className='name'>traguardo</div>
              <div className='details'>5/7 giorni</div>
            </div>
            <div className='single-achievement'>
              <div className='badge-container'>
                <LuBadge
                  color='purple'
                  size='30px'
                />
              </div>
              <div className='name'>traguardo</div>
              <div className='details'>5/7 giorni</div>
            </div>
            <div className='single-achievement'>
              <div className='badge-container'>
                <LuBadge
                  color='purple'
                  size='30px'
                />
              </div>
              <div className='name'>traguardo</div>
              <div className='details'>5/7 giorni</div>
            </div>
          </div>
        </Widget>
      </div>
    </Container>
  );
}

export default Home;
const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10vh;
  padding: 20px;
  gap: 20px;
  padding-bottom: 10vh;
  overflow: hidden;
  .logoutBtn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .widgetContainer {
    width: 100%;
    flex: 1;
    /* background-color: #ffffff10; */
    position: relative;
    overflow: scroll;
    .achievement-container {
      display: flex;
      gap: 20px;
      padding: 20px 0;
      overflow-x: scroll;
      position: relative;
      .fade {
        position: fixed;
        height: 150px;

        width: 30px;
        background: linear-gradient(90deg, #16181f, #16181f00);

        left: 0px;
        &:nth-child(2) {
          transform: rotate(180deg);
          left: auto;

          right: 10px;
        }
      }
      .single-achievement {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 20px;
        border: 2px solid ${({ theme }) => theme.colors.neon};
        border-radius: 10px;
        .badge-container {
          background-color: ${({ theme }) => theme.colors.white10};
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          width: 50px;
          border-radius: 50%;
        }
        .name {
          text-transform: capitalize;
          font-size: 18px;
          font-weight: 700;
          font-size: 20px;
          line-height: 1em;
        }
        .details {
          line-height: 1em;
          font-weight: 300;
        }
      }
    }
  }
`;
