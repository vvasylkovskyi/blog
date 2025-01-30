import {PostType} from './post';

interface PostResponse {
  data: {
    post: PostType;
  };
}

export {PostResponse};
