---
title: My Second Blog
subtitle: This Description Of My Second Blog
date: "2021-01-30"
---

# h1

## h2

### h3

Normal text

> ㅂㄱ파

- [ ] ㅇㄹㄷㄴㅇ
- [ ] ㄹㄷㄴㅇㄹ
- [ ] ㄷㄹㄴㅇㄹㄴ
- [x] ㄴㅇㄹ 

```javascript
export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />)
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...page, styleTags };
  }
```
