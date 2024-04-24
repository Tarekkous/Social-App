import React, { useState } from 'react'
import "./UpdateProfile.scss"
import { makeRequest } from '../../axios'
import { useMutation, useQueryClient } from 'react-query'

const UpdateProfile = ({ setOpenUpdate, user }) => {

    const [cover, setCover] = useState(null)
    const [profile, setProfile] = useState(null)
    const [texts, setTexts] = useState({
        name: "",
        city: "",
        website: ""
    });

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
    };



    const upload = async (file) => {
        try {
            // we create form data because we cant send the file directly so we send it in a formData
            const formData = new FormData();
            formData.append("file", file)
            const res = await makeRequest.post("/upload", formData);
            return res.data
        } catch (err) {
            console.log(err)
        }
    };


    const queryClient = useQueryClient()

    const mutation = useMutation((user) => {
        return makeRequest.put("/users", user);
    }, {
        onSuccess: () => {
            //refetch data 
            queryClient.invalidateQueries(["user"])
        },
    })

    const handleClick = async (e) => {
        e.preventDefault();
        let coverUrl ;
        let profileUrl ;
        coverUrl = cover ? await upload(cover) : user.coverPic
        profileUrl = profile ? await upload(profile) : user.profilePic

        mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
        setOpenUpdate(false)

    };




    return (
        <div className='update'>
            <button onClick={() => setOpenUpdate(false)} className='ExitBtn'>X</button>
            <h1>Update</h1>
            <form>
                <label htmlFor="cover" id='cover'>Cover Picture</label>
                <input type="file" name='cover' onChange={(e) => setCover(e.target.files[0])} />
                <label htmlFor="profile" id='profile'>Profile Picture</label>
                <input type="file"name='profile' onChange={(e) => setProfile(e.target.files[0])} />
                <label htmlFor="name">Name</label>
                <input type="text" name='name' id='name' placeholder={user.name} onChange={handleChange} />
                <label htmlFor="city">City</label>
                <input type="text" name='city' id='city' placeholder={user.city} onChange={handleChange} />
                <label htmlFor="website">Website</label>
                <input type="text" name='website' id='website' placeholder={user.website} onChange={handleChange} />

                <button className='updateBtn' onClick={handleClick}>Update</button>
            </form>
        </div>
    )
}

export default UpdateProfile;
