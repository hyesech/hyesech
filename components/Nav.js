import React, { useState } from "react";
import styled from "styled-components";
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons//bs";

const Container = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 999;
  right: ${(props) => (props.isActive ? "0" : "-300px")};
  transition: all 0.5s ease-in-out;
`;

const NavBtn = styled.button`
  all: unset;
  margin: 0.5rem;
  color: #0000ff;
  :hover {
    cursor: pointer;
  }
`;

const NavPage = styled.nav`
  width: 300px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const NavItems = styled.ul`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;
const NavTitle = styled.span`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: black;
  :hover {
    color: #0000ff;
  }
`;
const SubNavTitle = styled.span`
  font-weight: bold;
  color: #0000ff;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
`;
const NavItem = styled.li`
  margin: unset;
  margin: 0.2rem 0;
  font-size: 0.9rem;
  padding-left: 1.5rem;
  list-style: none;
`;

const A = styled.a`
  color: black;
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
      <NavBtn onClick={handleToggle}>
        {isActive ? (
          <BsArrowBarLeft size={25} />
        ) : (
          <BsArrowBarRight size={25} />
        )}
      </NavBtn>
      <NavPage>
        <NavItems>
          <NavTitle>
            <A href="/">BACK TO HOME</A>
          </NavTitle>
        </NavItems>
        <NavItems>
          <NavTitle>Projects</NavTitle>
          <SubNavTitle>Asker</SubNavTitle>
          <NavItem>
            <A href="/posts/asker-redux">Redux 적용기</A>
          </NavItem>
          <NavItem>
            <A href="/posts/asker-redux-saga">Redux Saga 적용기</A>
          </NavItem>
        </NavItems>
        <NavItems>
          <NavTitle>Errors</NavTitle>
          <SubNavTitle>MySQL</SubNavTitle>

          <NavItem>
            <A href="/posts/mysql-error-access-denied-for-user-root-localhost">
              MySQL, Access denied for user 'root'@'localhost'
            </A>
          </NavItem>
        </NavItems>
        <NavItems>
          <NavTitle>Bugs</NavTitle>
          {/* <NavItem>리스트게시34343434343물1</NavItem>
          <NavItem>리스트게시물2</NavItem>
          <NavItem>리스트게시물3</NavItem> */}
        </NavItems>
      </NavPage>
    </Container>
  );
};
export default Nav;
