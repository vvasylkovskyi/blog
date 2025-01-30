import {PostType} from './post';

interface AllPostsResponse {
  data: {
    blogs: Array<PostType>;
  };
}

export {AllPostsResponse};
