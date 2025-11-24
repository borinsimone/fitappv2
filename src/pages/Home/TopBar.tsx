import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { BiBell, BiX, BiUser } from "react-icons/bi";
import styled from "styled-components";
// import NotificationPanel from './NotificationPanel';
import {
  AnimatePresence,
  motion,
  useIsPresent,
} from "framer-motion";
// import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../../context/AuthContext";

function TopBar() {
  const { user } = useGlobalContext();
  const [notificationPanelOpen, setNotificationPanelOpen] =
    useState(false);
  const [notBadge, setNotBadge] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Your workout plan for today is ready",
      time: "24 minutes ago",
      type: "workout",
    },
    {
      id: 2,
      text: "Remember to drink water and stay hydrated",
      time: "1 hour ago",
      type: "health",
    },
    {
      id: 3,
      text: "You achieved your daily step goal. Great job!",
      time: "2 days ago",
      type: "achievement",
    },
  ]);

  useEffect(() => {
    setNotBadge(notifications.length > 0);
  }, [notifications]);

  // Close panels when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
      ) {
        setNotificationPanelOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buongiorno";
    if (hour >= 12 && hour < 18) return "Buon pomeriggio";
    return "Buona sera";
  };

  // Format date in a nice way
  const formattedDate = new Date().toLocaleDateString(
    "it-IT",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );
  const { userProfile, loadUserProfile } = useAuth();
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);
  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <UserSection>
        <UserAvatar
          onClick={() => console.log(userProfile)}
        >
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile?.name}
            />
          ) : (
            <BiUser size={24} />
          )}
        </UserAvatar>
        <UserInfo>
          <Greeting>
            {getGreeting()},{" "}
            <Username>{userProfile?.name}</Username>
          </Greeting>
          <DateDisplay>{formattedDate}</DateDisplay>
        </UserInfo>
      </UserSection>
      <Controls>
        <NotificationButton
          ref={notificationRef}
          onClick={() =>
            setNotificationPanelOpen(!notificationPanelOpen)
          }
          $hasNotifications={notBadge}
          $isOpen={notificationPanelOpen}
        >
          {notificationPanelOpen ? (
            <BiX size={22} />
          ) : (
            <BiBell size={22} />
          )}

          <AnimatePresence>
            {notificationPanelOpen && (
              <NotificationsPanel
                as={motion.div}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.4 }}
              >
                <PanelHeader>
                  <PanelTitle>Notifiche</PanelTitle>
                  <ClearButton
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </ClearButton>
                </PanelHeader>

                {notifications.length > 0 ? (
                  <NotificationsList>
                    {notifications.map((notification) => (
                      <AnimatedNotificationItem
                        key={notification.id}
                        $type={notification.type}
                      >
                        <NotificationContent>
                          <NotificationText>
                            {notification.text}
                          </NotificationText>
                          <NotificationTime>
                            {notification.time}
                          </NotificationTime>
                        </NotificationContent>
                        <DismissButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(
                              notifications.filter(
                                (n) =>
                                  n.id !== notification.id
                              )
                            );
                          }}
                        >
                          <BiX size={18} />
                        </DismissButton>
                      </AnimatedNotificationItem>
                    ))}
                  </NotificationsList>
                ) : (
                  <EmptyNotifications>
                    Non hai notifiche
                  </EmptyNotifications>
                )}
              </NotificationsPanel>
            )}
          </AnimatePresence>
        </NotificationButton>

        {/* <ProfileButton
          ref={profileRef}
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          $isOpen={profileMenuOpen}
        >
          <ProfileButtonText>My Profile</ProfileButtonText>
          <BiChevronDown size={18} />

          <AnimatePresence>
            {profileMenuOpen && (
              <ProfileMenu
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileMenuItem to='/account'>
                  <BiUser size={16} />
                  Account Settings
                </ProfileMenuItem>
                <MenuDivider />
                <LogoutButton
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                >
                  Sign Out
                </LogoutButton>
              </ProfileMenu>
            )}
          </AnimatePresence>
        </ProfileButton> */}
      </Controls>
    </Container>
  );
}

export default TopBar;

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  position: relative;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white20};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Greeting = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25em;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white70};
`;

const Username = styled.span`
  font-size: 1.2em;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
`;

const DateDisplay = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.white50};
  margin-top: 4px;
  text-transform: capitalize;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationButton = styled.div<{
  $hasNotifications: boolean;
  $isOpen: boolean;
}>`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.neon : theme.colors.white10};
  color: ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.dark : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isOpen, theme }) =>
      $isOpen ? theme.colors.neon : theme.colors.white20};
  }

  &::after {
    content: "";
    display: ${({ $hasNotifications, $isOpen }) =>
      $hasNotifications && !$isOpen ? "block" : "none"};
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.error};
    border-radius: 50%;
  }
`;

const NotificationsPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 90vw;
  background: ${({ theme }) => theme.colors.white10};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.white20};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  color: ${({ theme }) => theme.colors.white};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.neon};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationsList = styled.div`
  max-height: 320px;
  overflow-y: auto;
`;

const NotificationItem = styled(motion.div)<{
  $type: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white05};
  }

  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 100%;
    background: ${({ $type, theme }) => {
      switch ($type) {
        case "workout":
          return theme.colors.neon;
        case "health":
          return "#4CAF50";
        case "achievement":
          return "#FFC107";
        default:
          return theme.colors.white30;
      }
    }};
    position: absolute;
    left: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  padding-right: 12px;
`;

const NotificationText = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const DismissButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white10};
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.white70};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const EmptyNotifications = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white50};
  font-size: 14px;
`;

const AnimatedNotificationItem = ({
  children,
  onClick,
  $type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  $type: string;
}) => {
  const isPresent = useIsPresent();
  const animations = {
    style: {
      position: isPresent ? "static" : "absolute",
    },
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
      type: "spring",
      stiffness: 900,
      damping: 40,
    },
  };
  return (
    <NotificationItem
      {...animations}
      layout
      onClick={onClick}
      $type={$type}
    >
      {children}
    </NotificationItem>
  );
};
