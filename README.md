I'm hosting my blog as a static website on Amazon S3, so everything has to be generated compile-time. Blog posts are formatted in meta-marked (Markdown with an extension for metadata) and the page is generated with a Jade template using a Node.js script.

## Example
~/blogposts/hello.md
```markdown
---
Title: Hello World
Date: Nov 23, 2014
Identifier: helloworld
---
This is my blog!
```

And then I update the website on S3 with:
```bash
./publish.js ~/blogposts/*.md
```
