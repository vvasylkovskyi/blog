import fs from "fs";
import path from "path";

import express from "express";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import compression from "compression";

import { getBlogsData } from "./get-all-posts/get-all-posts";
import { getBlogById } from "./get-post-by-id/get-post-by-id";

import { App, getMarkedHTML } from "@vvasylkovskyi/core-ui";

const PORT = process.env.PORT || 3006;
const clientBundleFolderPath = "../dist-client";
const app = express();
app.use(compression());

app.get("/", async (_: express.Request, res: express.Response) => {
  let blogs: any[];
  try {
    blogs = await getBlogsData();
  } catch (err) {
    return res.status(500).send("Oops, better luck next time!");
  }

  const serializedData = JSON.stringify(blogs);

  const app = ReactDOMServer.renderToString(
    <StaticRouter location={`/`}>
      <App preloadedBlogs={serializedData} />
    </StaticRouter>
  );

  const indexFile = path.resolve(
    __dirname,
    `${clientBundleFolderPath}/index.html`
  );

  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<script>window.__BLOGS__ = ${serializedData}</script><div id="root">${app}</div>`
      )
    );
  });
});

app.get("/about", async (_: express.Request, res: express.Response) => {
  const app = ReactDOMServer.renderToString(
    <StaticRouter location={`/about`}>
      <App />
    </StaticRouter>
  );

  const indexFile = path.resolve(
    __dirname,
    `${clientBundleFolderPath}/index.html`
  );
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

app.get("/get-resume", (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "../resume/Viktor_Vasylkovskyi_Resume.pdf"
  );
  return res.download(filePath);
});

app.get("/posts/:id", (req: express.Request, res: express.Response) => {
  let blogData: any;
  try {
    blogData = getBlogById(req.params.id);
  } catch (err) {
    return res.status(500).send("Oops, better luck next time!");
  }

  const serializedData = JSON.stringify({
    ...blogData,
    content: getMarkedHTML(blogData.content),
    url: req.params.id,
  });

  const app = ReactDOMServer.renderToString(
    <StaticRouter location={`/posts/${req.params.id}`}>
      <App preloadedBlog={serializedData} />
    </StaticRouter>
  );

  const indexFile = path.resolve(`${clientBundleFolderPath}/index.html`);
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<script>window.__BLOG__ = ${serializedData}</script><div id="root">${app}</div>`
      )
    );
  });
});

app.use(
  "/posts/get-by-id/:id",
  (req: express.Request, res: express.Response) => {
    let blogData: any;
    try {
      blogData = getBlogById(req.params.id);
    } catch (err) {
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Fetched post",
      data: {
        post: {
          content: blogData.content,
          date: blogData.date,
          title: blogData.title,
          meta: blogData.meta,
        },
      },
    });
  }
);

app.get("/get-all-posts", async (_: express.Request, res: express.Response) => {
  try {
    const blogs = await getBlogsData();
    // Sending the files array as the response
    res.status(200).json({
      statusCode: 200,
      message: "Fetched all posts",
      data: { blogs },
    });
  } catch (e) {
    res.status(400).json({
      statusCode: 200,
      message: `Error While Fetching Posts: ${e}`,
    });
  }
});

app.use("/posts/images/:id", (req: express.Request, res: express.Response) => {
  const imagePath = path.join(
    process.cwd(),
    `../blog-content/ready/${req.params.id}/${req.path}`
  );

  fs.readFile(imagePath, (err: any, data: ArrayBuffer) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    }
  });
});

app.use(express.static(`${clientBundleFolderPath}`));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
