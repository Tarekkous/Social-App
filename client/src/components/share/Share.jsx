import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, } from 'react-query'
import { makeRequest } from "../../axios";
const Share = () => {

  const [file, setFile] = useState(null)
  const [desc, setDesc] = useState("")

  const { currentUser } = useContext(AuthContext)

  const queryClient = useQueryClient()

// On fait appel à l'api en utilisant mutation de reactquery (pour pouvoir utiliser les POSTS partout dans l'app)
  const mutation = useMutation((newPost) => {
    return makeRequest.post("/posts", newPost);
  }, {
    onSuccess: () => {
      //refetch data already getted before
      queryClient.invalidateQueries("posts")
    },
  })

  const handleClick = e => {
    e.preventDefault()
    mutation.mutate({desc})
    
  };


  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <input type="text"
            placeholder={`What's on your mind ${currentUser.name}?`}
            onChange={(e) => setDesc(e.target.value)} />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
