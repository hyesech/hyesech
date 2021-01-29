import React from "react";

const CodeBlock = (props) => {
    return <pre style={{backgroundColor:"#fafafa", padding="0.75rem", fontSize="0.8rem", fontFamily="Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace"}}></pre>
};

const markdownStyle = {
  code: CodeBlock,
  blockqoute: BlockQoute,
};

export default markdownStyle;


background: #fafafa;
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 0.8rem;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;