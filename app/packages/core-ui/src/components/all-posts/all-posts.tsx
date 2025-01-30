import React from "react";

import { PostType } from "../../interfaces/post";

import { PostItem } from "../post-item/post-item";

type AllPostsProps = {
  preloadedBlogs?: string | PostType[];
  handlePreloadBlog: (url: string) => void;
};

export const AllPosts = ({
  preloadedBlogs,
  handlePreloadBlog,
}: AllPostsProps) => {
  let blogsListToRender: PostType[] = [];

  if (preloadedBlogs) {
    blogsListToRender =
      typeof preloadedBlogs === "string"
        ? JSON.parse(preloadedBlogs)
        : preloadedBlogs;
  }

  if (!blogsListToRender || !blogsListToRender.length) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="my-5">
        <div>
          {blogsListToRender.map((post: PostType) => (
            <PostItem
              key={post.url}
              url={post.url}
              title={post.title}
              date={post.date}
              category={post.category}
              metaText={post.metaText}
              handlePreloadBlog={handlePreloadBlog}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};
