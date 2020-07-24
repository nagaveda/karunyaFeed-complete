import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import M from 'materialize-css';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Home = () => {
    const [comment, setComment] = useState('');
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const defaultPic = "https://res.cloudinary.com/nagaveda999/image/upload/v1594638348/images_ughhmp.png";
    useEffect(()=>{
        fetch('/myposts', {
            headers: {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.myposts);
        })
    },[]);

    const likePost = (id) => {
        fetch("/like", {
            method:"PUT", 
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map((item)=> {
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            });
            setData(newData);
        }).catch((err)=>{
            console.log(err);
        });
    };
    const unlikePost = (id) => {
        fetch("/unlike", {
            method:"PUT", 
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map((item)=> {
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            });
            setData(newData);
        }).catch((err)=>{
            console.log(err);
        });
    };
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:postId,
                text:text
            })
        })
        .then(res=>res.json())
        .then((result)=> {
            const newData = data.map((item)=> {
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            });
            setData(newData);
        }).catch((err)=>{
            console.log(err);
        });
    };
    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method:"DELETE",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            if(result.error){
                M.toast({html: result.error, classes:"#c62828 red darken-3"});
            }
            else{
                M.toast({html: "Post deletion succesful!", classes:"#ff9800 orange"});
            }
            const newData = data.filter(item=>{
                return item._id !== result._id
            });
            setData(newData);
        })
    };
    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/comments/${commentId}`, {
            method:"DELETE",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            const newData = data.map((item)=> {
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            });
            setData(newData);
            M.toast({html:"Comment deleted succesfully!", classes: "#757575 grey darken-1"});

        }).catch(err=>{
            console.log(err);
        })
    }
    return(
        
        <div className="home">
        {
            (data.length!==0)?
            data.map((item)=>{
                return(
                    <div key={item._id} className="card home-card">
                        <h5 style={{padding:"5px"}}><Link to={"/profile/"+item.postedBy._id}><img style={{width:"30px",height:"30px", borderRadius:"20px"}} src={item.postedBy.pic}></img> {item.postedBy.name}</Link>{item.postedBy._id === state._id && 
                            <i style={{float:"right"}} className="material-icons" onClick={()=>deletePost(item._id)}>delete</i>
                             }</h5>
                        <div className="card-image">
                            <img alt="post" src = {item.photo}/>
                        </div>
                        <div className="card-content">
                        <i onClick={()=>{
                            setUsers(item.likes);
                            console.log(item.likes);
                            toggle();
                        }}  className="material-icons" style={{color:"red"}}>
                        favorite
                        </i>
                        
                        {item.likes.includes(state._id)
                        ? <i className="material-icons" 
                        onClick = {() => {unlikePost(item._id)}}
                        >thumb_down</i>
                        : 
                        <i className="material-icons" 
                        onClick = {() => {likePost(item._id)}}
                        >thumb_up</i>
                        }
                            <h6 onClick={()=>{
                                setUsers(item.likes);
                                console.log(item.likes);
                                toggle();
                            }}>
                            {item.likes.length} likes
                            </h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <form onSubmit={(event)=>{
                                 event.preventDefault();
                                 makeComment(event.target[0].value,item._id);
                                 setComment('');
                            }}>
                                <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="add comment"/>
                            </form>
                            {
                                item.comments.map((record)=> {
                                    return(
                                    <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy?record.postedBy.name:"Deleted User"}</span> {record.text} {(record.postedBy)?record.postedBy._id === state._id && <i style={{float:"right"}} className="material-icons" 
                        onClick = {() => {deleteComment(item._id,record._id )}}
                        >delete</i>:""}</h6>
                                    )
                                })
                            }
                            <Modal  isOpen={modal} toggle={toggle} >
                            <ModalHeader toggle={toggle}>Likes...</ModalHeader>
                            <ModalBody>
                            <ul className="collection">
                                {users.map((item) => {
                                return (
                                <Link to={"/profile/"+item._id}>
                                    <li className="collection-item"><img alt={`${item.name} pic`} width="35px" height="35px" style={{borderRadius:"20px"}} src={item.pic?item.pic:defaultPic}></img>  {item.name?item.name:"Deleted User"}</li>
                                </Link> 
                                )
                                })}
                            </ul>
                            </ModalBody>
                        </Modal>  
                            
                        </div>
                    </div>
                )
            })
            :
            <div>
                <h1><p className="brand-logo" style={{textAlign:"center"}}>Post something to view your posts here...</p></h1>    
            </div>
            
        }
            
        </div>
    );
}

export default Home;