import React from "react";

import { AllPosts } from "../../components/all-posts/all-posts";
import { PostType } from "../../interfaces/post";
import HelmetWrapper from "../../components/helmet-wrapper/helmet-wrapper";
// import {isDesktop} from '../../utils/is-desktop';

type HomeProps = {
  preloadedBlogs?: string | PostType[];
  handlePreloadBlog: (url: string) => void;
};

const Home = ({ preloadedBlogs, handlePreloadBlog }: HomeProps) => {
  return (
    <React.Fragment>
      <HelmetWrapper
        title={"Web Blog © Viktor Vasylkovskyi"}
        meta={"Web Blog © Viktor Vasylkovskyi"}
      ></HelmetWrapper>
      <div className="greetings-section">
        <div className="greetings__left">
          <h1 className="heading-h1">Hi, I'm Viktor</h1>
          <div className="greeting-flex-wrapper">
            <h2 className="greeting-heading">Welcome to my blog!</h2>
            {/* <img
              src="/static/book-open.svg"
              alt="Open Book"
              width={isDesktop() ? '45' : '28'}
              height={isDesktop() ? '40' : '25'}
              className="blog-book-icon"
            /> */}
          </div>
        </div>
        {/* <div className="greetings__right">
          <img
            src="/static/hacker.svg"
            width="193"
            height="197"
            alt="Hacker Icon"
            className="hacker-icon"
          />
        </div> */}
      </div>
      <AllPosts
        preloadedBlogs={preloadedBlogs}
        handlePreloadBlog={handlePreloadBlog}
      />
    </React.Fragment>
  );
};

export default Home;
