import React from "react";
import styled from "styled-components";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ArticleWrapper = styled.article`
  width: 100%;
  max-width: 1000px;
  height: 100%;
  margin: 2rem 0;
  padding: 0 1rem;
`;
const HeaderWrapper = styled.div`
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const TitleWrapper = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;
const DateWrapper = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostTemplate = ({ content, data }) => {
  // This holds the data between `---` from .md file.
  const frontmatter = data;
  const markdownBody = content;

  return (
    <Container>
      <ArticleWrapper>
        <HeaderWrapper>
          <TitleWrapper>{frontmatter.title}</TitleWrapper>
          <DateWrapper>{frontmatter.date}</DateWrapper>
        </HeaderWrapper>
        <ArticleWrapper>
          <ReactMarkdown source={markdownBody} />
        </ArticleWrapper>
      </ArticleWrapper>
    </Container>
  );
};

PostTemplate.getInitialProps = async (context) => {
  const { slug } = context.query;

  // Import our .md file using the `slug` from the URL
  const content = await import(`../../contents/${slug}.md`);

  // Parse .md data through `matter`
  const data = matter(content.default);

  // Pass data to our component props
  return { ...data };

  return { slug };
};

export default PostTemplate;
