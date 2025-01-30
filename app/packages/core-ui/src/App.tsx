import React from "react";
import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/footer/footer";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Post from "./pages/post/post";
import About from "./pages/about/about";

import { withRouter } from "./hooks/with-router";
import { fetchAllPosts } from "./http/fetch-all-posts";
import { PostType } from "./interfaces/post";
import fetchPostById from "./http/fetch-post-by-id";

type AppProps = {
  preloadedBlogs?: string;
  preloadedBlog?: string | PostType;
  location: Location;
};

type AppState = {
  clientPreloadedBlogs: PostType[];
  clientPreloadedFormattedBlogs: { [url: string]: Partial<PostType> };
  isLoading: boolean;
};

class App extends React.Component<AppProps, AppState> {
  state = {
    clientPreloadedBlogs: [] as PostType[],
    clientPreloadedFormattedBlogs: {} as { [url: string]: Partial<PostType> },
    isLoading: false,
  };

  handlePreloadAllPosts = async () => {
    if (this.props.preloadedBlogs || this.state.clientPreloadedBlogs.length) {
      return;
    }

    const posts = await fetchAllPosts();
    this.setState({ clientPreloadedBlogs: posts });
  };

  handlePreloadPost = async (url: string) => {
    if (
      !this.state.isLoading &&
      !this.state.clientPreloadedFormattedBlogs[url]
    ) {
      this.setState({ isLoading: true });
      const post = await fetchPostById(url);
      this.setState((prevState: AppState) => ({
        ...prevState,
        isLoading: false,
        clientPreloadedFormattedBlogs: {
          ...prevState.clientPreloadedFormattedBlogs,
          [url]: post,
        },
      }));
    }
  };

  getNextBlog = () => {
    const { preloadedBlog, location } = this.props;
    const { clientPreloadedFormattedBlogs } = this.state;
    const isHome = location.pathname === "/" ? true : false;

    let nextPostId = null;
    if (!isHome) {
      nextPostId = location.pathname.split("/")[2];
    }

    const nextClientPreloadedBlog =
      nextPostId && clientPreloadedFormattedBlogs[nextPostId!];

    let shouldUsePreloadedBlog = false;

    const parsedPreloadedBlog: PostType =
      typeof preloadedBlog === "string"
        ? JSON.parse(preloadedBlog)
        : preloadedBlog;

    if (
      parsedPreloadedBlog &&
      nextPostId === (parsedPreloadedBlog as PostType).url
    ) {
      shouldUsePreloadedBlog = true;
    }

    return shouldUsePreloadedBlog ? preloadedBlog : nextClientPreloadedBlog;
  };

  render() {
    const { preloadedBlogs, location } = this.props;
    const { clientPreloadedBlogs } = this.state;

    const blogsList = preloadedBlogs ?? clientPreloadedBlogs;

    const blog = this.getNextBlog();

    return (
      <React.Fragment>
        <div className="app-container">
          <Header
            handlePreloadAllPosts={this.handlePreloadAllPosts}
            location={location}
          />
          <div className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    handlePreloadBlog={this.handlePreloadPost}
                    preloadedBlogs={blogsList}
                  />
                }
              />
              {/* <Route path="/about" element={<About />} /> */}
              <Route
                path="/posts/:id"
                element={<Post preloadedBlog={blog!} />}
              ></Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
