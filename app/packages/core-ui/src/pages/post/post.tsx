import React from "react";

import { PostType } from "../../interfaces/post";
import { useScrollToTop } from "../../hooks/use-scroll-to-top";
import HelmetWrapper from "../../components/helmet-wrapper/helmet-wrapper";
type PostProps = {
  preloadedBlog?: string | Partial<PostType>;
};

const Post = ({ preloadedBlog }: PostProps) => {
  useScrollToTop();

  let blogToRender: Partial<PostType> = {};
  if (preloadedBlog) {
    blogToRender =
      typeof preloadedBlog === "string"
        ? JSON.parse(preloadedBlog)
        : preloadedBlog;
  }

  if (!blogToRender?.content) {
    return null;
  }

  return (
    <React.Fragment>
      <HelmetWrapper
        title={blogToRender.title!}
        meta={(blogToRender as any).meta!}
      ></HelmetWrapper>
      <div className="my-5">
        <div className="article-wrapper">
          <article>
            <main>
              <div className="date-container date-container--highlight">
                <p className="date-text">{blogToRender.date}</p>
              </div>
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{
                  __html: blogToRender.content,
                }}
              ></div>
            </main>
          </article>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Post;
