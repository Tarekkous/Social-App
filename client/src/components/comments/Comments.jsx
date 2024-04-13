import { useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useQuery } from 'react-query'
import moment from "moment";


const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);


  const { isLoading, error, data } = useQuery("comments", () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data
    })
  )

console.log(data)



  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" />
        <button>Send</button>
      </div>

      {isLoading? "loading.." : data.map((comment) => (

        <div className="comment">
          <img src={comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>

      ))}
    </div>
  );
};

export default Comments;
