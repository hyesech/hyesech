import React from "react";
import styled from "styled-components";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

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
const TitleWrapper = styled.header`
  font-size: 2.5rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.2rem;
  text-align: center;
`;

const SubTitleWrapper = styled.article`
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const DateWrapper = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #0000ff;
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
          <SubTitleWrapper>{frontmatter.subtitle}</SubTitleWrapper>
          <DateWrapper>{frontmatter.date}</DateWrapper>
        </HeaderWrapper>
        <ArticleWrapper>
          <ReactMarkdown plugins={[gfm]} children={markdownBody} />
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
};

export default PostTemplate;
