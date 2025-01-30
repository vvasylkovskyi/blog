import { AxiosResponse } from "axios";
import { AllPostsResponse } from "../interfaces/allPostsResponse";
import { PostType } from "../interfaces/post";
import { httpRequest } from "./request";

export async function fetchAllPosts(): Promise<PostType[]> {
  try {
    const response: AxiosResponse<AllPostsResponse, AllPostsResponse> =
      await httpRequest.get("/get-all-posts");

    return response.data.data.blogs;
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
  }

  return [];
}
