import React from "react";
import styled from "styled-components";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

const Container = styled.div``;
const TitleWrapper = styled.div``;
const ArticleWrapper = styled.div``;

const PostTemplate = ({ content, data }) => {
  // This holds the data between `---` from .md file.
  const frontmatter = data;
  const markdownBody = content;

  return (
    <Container>
      <TitleWrapper>
        <h1>{frontmatter.title}</h1>
      </TitleWrapper>
      <ArticleWrapper>
        <ReactMarkdown source={markdownBody} />
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
