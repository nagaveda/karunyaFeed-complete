import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const {userId} = useParams();
    const [showfollow, setShowFollow] = useState(state?!state.following.includes(userId):true);

    useEffect(()=> {
        fetch(`/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then((result) => {
            setProfile(result);
        })
    }, []);

    const followUser = () => {
        fetch('/follow', {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}});
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: [...prevState.user.followers,data._id]
                    }
                }
            })
        }).catch(err=>{
            console.log(err);
        });
        setShowFollow(false);
    };
    const unfollowUser = () => {
        fetch('/unfollow', {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}});
            localStorage.setItem("user", JSON.stringify(data));
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
        }).catch(err=>{
            console.log(err);
        });
        setShowFollow(true);
    };
    return(
        <>
        {userProfile?
            <div style={{maxWidth:"550px", margin: "0px auto"}}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "18px 0px",
                    borderBottom:  "1px solid grey"
                }}>
                    <div>
                        <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                        src = {userProfile.user.pic}
                        alt = "profile pic"
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                            <h6>{userProfile .posts.length} posts</h6>
                            <h6>{userProfile.user.followers.length} followers</h6>
                            <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {   
                            !(userProfile.user._id.toString()===localStorage.getItem("userId"))
                        ?
                            showfollow?
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-2"
                            onClick = {()=>followUser()}
                            >
                            Follow
                            </button>
                        :
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-2"
                            onClick = {()=>unfollowUser()}
                            >
                                Unfollow
                            </button>
                        
                        :
                        <div>
                        <h5>You need not follow yourself dude..🤔</h5>
                        
                        </div>
                        }
                        
                        
                        
                    </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map((item) => {
                            return(
                                <img key={item._id} style={{width:"30% ",height:"30% "}} className="item" alt={item.title} src={item.photo}/>
                            );
                        })
                    }
                </div>
            </div>
            :
            <div>
            <h1 className="brand-logo" style={{textAlign:"center"}}><FontAwesomeIcon icon={faSpinner} spin={true}/></h1>
            <h5 className="brand-logo" style={{textAlign:"center"}}>Loading Profile </h5>
            </div>
            }
                
            </>
    );
}

export default Profile;