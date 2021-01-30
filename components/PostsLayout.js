// Post Layout
import React from "react";
import PropTypes from "prop-types";
import Nav from "./Nav";

const PostsLayout = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
};

PostsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PostsLayout;
