import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import './App.scss';
import {App} from '@vvasylkovskyi/core-ui';

// Get the initial data passed from the server
const blogs = (window as any).__BLOGS__;
const blog = (window as any).__BLOG__;

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter>
    <App preloadedBlogs={blogs} preloadedBlog={blog} />
  </BrowserRouter>
);
