import {AxiosResponse} from 'axios';
import getMarkedHTML from '../shared/get-marked-html';
import {PostType} from '../interfaces/post';
import {PostResponse} from '../interfaces/postResponse';
import {httpRequest} from './request';

async function fetchPostById(id: string): Promise<Partial<PostType>> {
  try {
    const response: AxiosResponse<PostResponse, PostResponse> =
      await httpRequest.get(`/posts/get-by-id/${id}`);

    const post = {
      date: response.data.data.post.date,
      content: getMarkedHTML(response.data.data.post.content),
    };

    return post;
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
  }

  return {} as PostType;
}

export default fetchPostById;
