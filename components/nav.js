import React from "react";
import styled from "styled-components";

const Container = styled.nav`
  position: fixed;
  width: 100vw;
  height: 50px;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavBtn = styled.button`
  all: unset;
  font-size: 1.5rem;
  font-weight: bold;
  :hover {
    color: #0000ff;
  }
  :active {
    color: #0000ff;
  }
`;

const Nav = () => {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <Container>
      <NavBtn onClick={handleClick}>&rarr;</NavBtn>
    </Container>
  );
};
export default Nav;
