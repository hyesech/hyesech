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
  background-color: rgba(0, 0, 0, 0.01);
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
            <a href="/posts/markdown-test">Markdown Test</a>
          </NavTitle>
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
