import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiExit,
  BiUser,
  BiLock,
  BiChevronRight,
  BiEdit,
  BiSave,
  BiTrash,
  BiX,
} from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";

function Account() {
  const { user, logout, updateProfile, deleteAccount } =
    useAuth();
  // TODO: implement updateProfile and deleteAccount functions
  // const { darkMode, toggleDarkMode } = useGlobalContext();

  const [editingProfile, setEditingProfile] =
    useState(false);
  const [editingPassword, setEditingPassword] =
    useState(false);
  const [confirmingDelete, setConfirmingDelete] =
    useState(false);

  const [profileData, setProfileData] = useState({
    displayName: user?.name || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileData);
      setEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUpdatePassword = async () => {
    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // Call your password update function here
      // await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setEditingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Redirect should happen automatically via auth listener
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  const { userProfile } = useAuth();

  return (
    <Container>
      <Header>
        <Title
          onClick={() => {
            console.log(userProfile);
          }}
        >
          Account
        </Title>
        <LogoutButton onClick={logout}>
          <BiExit size={24} />
        </LogoutButton>
      </Header>

      <Content>
        <ProfileSection>
          <ProfileHeader>
            <Avatar
              onClick={() => {
                console.log(userProfile);
              }}
            >
              {userProfile.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                />
              ) : (
                <BiUser size={40} />
              )}
            </Avatar>

            <ProfileInfo>
              <ProfileName>
                {userProfile.name || "User"}
              </ProfileName>
              <ProfileEmail>
                {userProfile.email}
              </ProfileEmail>
            </ProfileInfo>

            <EditButton
              onClick={() => setEditingProfile(true)}
            >
              <BiEdit size={20} />
            </EditButton>
          </ProfileHeader>
        </ProfileSection>

        <SettingsSection>
          <SectionTitle>Settings</SectionTitle>

          <SettingItem
            onClick={() => setEditingProfile(true)}
          >
            <SettingIcon>
              <BiUser size={20} />
            </SettingIcon>
            <SettingText>Edit Profile</SettingText>
            <BiChevronRight size={20} />
          </SettingItem>

          <SettingItem
            onClick={() => setEditingPassword(true)}
          >
            <SettingIcon>
              <BiLock size={20} />
            </SettingIcon>
            <SettingText>Change Password</SettingText>
            <BiChevronRight size={20} />
          </SettingItem>

          {/* <SettingItem onClick={toggleDarkMode}>
            <SettingIcon>
              {darkMode ? <BiSun size={20} /> : <BiMoon size={20} />}
            </SettingIcon>
            <SettingText>{darkMode ? 'Light Mode' : 'Dark Mode'}</SettingText>
            <ToggleSwitch active={darkMode}>
              <ToggleHandle active={darkMode} />
            </ToggleSwitch>
          </SettingItem> */}

          <DangerZone>
            <SectionTitle warning>Danger Zone</SectionTitle>
            <DangerButton
              onClick={() => setConfirmingDelete(true)}
            >
              <BiTrash size={20} />
              Delete Account
            </DangerButton>
          </DangerZone>
        </SettingsSection>
      </Content>

      <AnimatePresence>
        {editingProfile && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay
              onClick={() => setEditingProfile(false)}
            />
            <ModalContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Edit Profile</ModalTitle>
                <CloseButton
                  onClick={() => setEditingProfile(false)}
                >
                  <BiX size={24} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Display Name</Label>
                <Input
                  type="text"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleProfileChange}
                  placeholder="Your name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Your email"
                />
              </FormGroup>

              <FormGroup>
                <Label>Profile Picture URL</Label>
                <Input
                  type="text"
                  name="photoURL"
                  value={profileData.photoURL}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/your-photo.jpg"
                />
              </FormGroup>

              <SaveButton onClick={handleUpdateProfile}>
                <BiSave size={20} />
                Save Changes
              </SaveButton>
            </ModalContent>
          </Modal>
        )}

        {editingPassword && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay
              onClick={() => setEditingPassword(false)}
            />
            <ModalContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Change Password</ModalTitle>
                <CloseButton
                  onClick={() => setEditingPassword(false)}
                >
                  <BiX size={24} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                />
              </FormGroup>

              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                />
              </FormGroup>

              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                />
              </FormGroup>

              <SaveButton onClick={handleUpdatePassword}>
                <BiSave size={20} />
                Update Password
              </SaveButton>
            </ModalContent>
          </Modal>
        )}

        {confirmingDelete && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay
              onClick={() => setConfirmingDelete(false)}
            />
            <ModalContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle warning>
                  Delete Account
                </ModalTitle>
                <CloseButton
                  onClick={() => setConfirmingDelete(false)}
                >
                  <BiX size={24} />
                </CloseButton>
              </ModalHeader>

              <WarningText>
                This action cannot be undone. All your data
                will be permanently deleted.
              </WarningText>

              <ButtonGroup>
                <CancelButton
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancel
                </CancelButton>
                <DeleteButton onClick={handleDeleteAccount}>
                  <BiTrash size={20} />
                  Delete Permanently
                </DeleteButton>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default Account;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neon};
`;

const LogoutButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.error};
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.error};
  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ProfileSection = styled.section`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.neon};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neon20};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white20};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ProfileEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white70};
`;

const EditButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neon};
    color: ${({ theme }) => theme.colors.dark};
  }
`;

const SettingsSection = styled.section`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 16px;
  padding: 24px;
`;

const SectionTitle = styled.h3<{ warning?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme, warning }) =>
    warning ? theme.colors.error : theme.colors.white};
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const SettingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.neon};
  margin-right: 16px;
`;

const SettingText = styled.span`
  flex: 1;
  font-size: 16px;
`;

// const ToggleSwitch = styled.div<{ active: boolean }>`
//   width: 50px;
//   height: 26px;
//   border-radius: 13px;
//   padding: 2px;
//   background: ${({ active, theme }) =>
//     active ? theme.colors.neon : theme.colors.white20};
//   transition: all 0.3s ease;
//   position: relative;
// `;

// const ToggleHandle = styled.div<{ active: boolean }>`
//   width: 22px;
//   height: 22px;
//   border-radius: 50%;
//   background: white;
//   position: absolute;
//   left: ${({ active }) => (active ? 'calc(100% - 24px)' : '2px')};
//   transition: all 0.3s ease;
// `;

const DangerZone = styled.div`
  margin-top: 32px;
  border-top: 1px solid
    ${({ theme }) => theme.colors.white20};
  padding-top: 24px;
`;

const DangerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  z-index: 101;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h3<{ warning?: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme, warning }) =>
    warning ? theme.colors.error : theme.colors.neon};
`;

const CloseButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white10};

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.white70};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white10};
  border: 1px solid ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const WarningText = styled.p`
  color: ${({ theme }) => theme.colors.white70};
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
