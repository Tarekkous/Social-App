import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Post = ({ post }) => {

  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  const { currentUser } = useContext(AuthContext)

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data
    })
  );

  // récupérer les commentaire pour le nombre de commentaire ( meme fonction que dans le composant commentaires)
  const { data: commentsData, isLoading: commentsLoading } = useQuery(["comments", post.id], () =>
    makeRequest.get("/comments?postId=" + post.id).then((res) => {
      return res.data
    })
  );


  const queryClient = useQueryClient()

  //! DELETE / ADD LIKES
  const mutation = useMutation((liked) => {
    if (liked) return makeRequest.delete("/likes?postId=" + post.id);
    return makeRequest.post("/likes", { postId: post.id })
  }, {
    onSuccess: () => {
      //refetch likes already getted
      queryClient.invalidateQueries(["likes"])
    },
  })


//! DELETE POST
  const deleteMutation = useMutation((postId) => {
    return makeRequest.delete(`/posts/${postId}`)
  }, {
    onSuccess: () => {
      //refetch likes already getted
      queryClient.invalidateQueries(["posts"])
    },
  });



  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id))
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id)
  }



  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (<button onClick={handleDelete}>delete</button>)}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? "loading" : Array.isArray(data) && data.includes(currentUser.id) ?
              (<FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />)
              : (<FavoriteBorderOutlinedIcon onClick={handleLike} />)}
            {Array.isArray(data) && data.length}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsLoading ? "Loading..." : `${commentsData.length} comments`}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
