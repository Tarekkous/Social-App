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

  const upload = async () => {
    try {
      // we create form data because we cant send the file directly so we send it in a formData
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData);
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  const { currentUser } = useContext(AuthContext)

  const queryClient = useQueryClient()

  //!Mutation (on publie un post et on actualise la fonction GET des posts dans posts.jsx)
  // On fait appel à l'api en utilisant mutation de reactquery (pour pouvoir utiliser les POSTS partout dans l'app)
  const mutation = useMutation((newPost) => {
    return makeRequest.post("/posts", newPost);
  }, {
    onSuccess: () => {
      //refetch data already getted before in posts.jsx
      queryClient.invalidateQueries("posts")
    },
  })

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("")
    setFile(null)

  };


  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <input type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)} value={desc}/>
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)}></img>}
          </div>
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
