import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from 'react-query'
import {  useEffect } from "react";


const Posts = ({userId}) => {


  const { isLoading, error, data } = useQuery("posts", () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data
    })
  );

  // !! => J'ai utilisé le console.log dans useEffect , pour éviter que les logs s'affichent plusieurs fois dans la console du navigateur à chaque réexécution du code 
  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);


  return <div className="posts">
    {error ? "something went wrong" : (isLoading ? "loading.." : data.map(post => (
      <Post post={post} key={post.id} />
    )))}
  </div>;
};

export default Posts;
