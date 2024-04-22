import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {

  const { currentUser } = useContext(AuthContext)


  // pour récupérer l'id de l'url qui se trouve a la troisieme postion apres chaque "/" on utilise uselocation hook

  const userId = parseInt(useLocation().pathname.split("/")[2])

  // Getting profileUser infos
  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data
    })
  );


  // Getting followers
  const { isLoading: rlisLoading, data: relationshipData } = useQuery(["relationship", userId], () =>
    makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
      return res.data
    })
  );


  const queryClient = useQueryClient()

  const mutation = useMutation((following) => {
    if (following) return makeRequest.delete("/relationships?userId="+ userId);
    return makeRequest.post("/relationships", {userId})
  }, {
    onSuccess: () => {
      //refetch likes already getted
      queryClient.invalidateQueries(["relationship"])
    },
  })



  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id))
  }






  return (
    <div className="profile">
      {isLoading ? "loading" : <>
        <div className="images">
          <img
            src={data.coverPic}
            alt=""
            className="cover"
          />
          <img
            src={data.profilePic}
            alt=""
            className="profilePic"
          />

        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{data.name}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city}</span>
                </div>

                <div className="item">
                  <LanguageIcon />
                  <span>{data.website}</span>
                </div>
              </div>

              {rlisLoading ? "Loading" :
                userId === currentUser.id ? (
                  <button>Update</button>
                ) : (
                  <button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ? "Following" : "Follow"}  </button>
                )}
            </div>

            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts />
        </div>
      </>}
    </div>
  );
};

export default Profile;

