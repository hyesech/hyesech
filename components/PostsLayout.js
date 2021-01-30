// Post Layout
import React from "react";
import PropTypes from "prop-types";

const PostsLayout = ({ children }) => {
  return <div>{children}</div>;
};

PostsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PostsLayout;
