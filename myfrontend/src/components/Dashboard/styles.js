import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const Sidebar = styled.div`
  width: 250px;
  background: #2f3542;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100%;
  padding-top: 20px;

  @media (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? '250px' : '0')};
    transition: width 0.3s;
  }
`;

export const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);

  @media (max-width: 768px) {
    margin-left: ${({ isOpen }) => (isOpen ? '250px' : '0')};
    width: ${({ isOpen }) => (isOpen ? 'calc(100% - 250px)' : '100%')};
    transition: margin-left 0.3s, width 0.3s;
  }
`;

export const ToggleButton = styled(FaBars)`
  display: none;
  color: white;
  font-size: 2rem;
  margin-left: auto;
  margin-right: 20px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
`;

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #57606f;
  }
`;

export const Icon = styled.div`
  margin-right: 10px;
`;

export const LogoutButton = styled.button`
  margin-top: auto;
  padding: 15px 20px;
  background: #ff4757;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e84118;
  }
`;
