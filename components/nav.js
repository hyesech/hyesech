import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 99;
  right: ${(props) => (props.isActive ? "0" : "-300px")};
  transition: all 0.5s ease-in-out;
`;

const NavBtn = styled.h4`
  padding: 0.5rem;
  font-weight: bold;
  :hover {
    color: #0000ff;
    cursor: pointer;
  }
`;

const NavPage = styled.nav`
  width: 300px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.01);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NavItems = styled.ul`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;
const NavTitle = styled.span`
  font-weight: bold;
  margin-bottom: 1rem;
  color: #0000ff;
`;
const NavItem = styled.li`
  font-size: 0.8rem;
  padding-left: 1rem;
  :hover {
    color: #0000ff;
    cursor: e-resize;
  }
`;

const Nav = () => {
  const [isActive, setIsActive] = useState(false);
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <Container isActive={isActive}>
      <NavBtn onClick={handleToggle}>{isActive ? "⏄" : "⏂"}</NavBtn>
      <NavPage>
        <NavItems>
          <NavTitle>리스트 제목</NavTitle>
          <NavItem>리스트게시34343434343물1</NavItem>
          <NavItem>리스트게시물2</NavItem>
          <NavItem>리스트게시물3</NavItem>
        </NavItems>
        <NavItems>
          <NavTitle>리스트 제목</NavTitle>
          <NavItem>리스트게시34343434343물1</NavItem>
          <NavItem>리스트게시물2</NavItem>
          <NavItem>리스트게시물3</NavItem>
        </NavItems>
        <NavItems>
          <NavTitle>리스트 제목</NavTitle>
          <NavItem>리스트게시34343434343물1</NavItem>
          <NavItem>리스트게시물2</NavItem>
          <NavItem>리스트게시물3</NavItem>
        </NavItems>
      </NavPage>
    </Container>
  );
};
export default Nav;
