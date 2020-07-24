import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import {Form,Modal, Button} from 'react-bootstrap';
import M from 'materialize-css';
const Profile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const history = useHistory();
    const [mypics, setPics] = useState([]);
    const [image,setImage] = useState("");
    const {state, dispatch} = useContext(UserContext);
    
    const handleSubmit = () => {
        fetch('/updateuser', {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }, 
            body: JSON.stringify({
                name:name,
                email:email
            })
           
        }).then((res) => res.json())
        .then(data=>{
            if(data.error){
                return M.toast({html:data.error, classes:"#c62828 red darken-3"});
            }
            M.toast({html:"Profile Updated succesfully! ", classes:"#64ffda teal accent-2"});
            localStorage.clear();
            history.push('/signin');
            window.location.reload();
        })
        .catch(err=>{
            console.log(err);
        });
    };
    useEffect(()=> {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then((result) => {
            setPics(result.myposts);
        })
    }, []);
    useEffect(()=>{
        if(image){
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "karunyaFeed");
            data.append("cloud_name", "nagaveda999");
            fetch("https://api.cloudinary.com/v1_1/nagaveda999/image/upload", {
                method: "POST",
                body:data
            })
            .then(res => res.json())  
            .then(data => {
                fetch('/updatepic', {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}));
                    dispatch({type:"UPDATEPIC", payload:result.pic});
                    M.toast({html:"Pic updated successfully !", classes:"#42a5f5 blue lighten-1"})
                })
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [image]);
    const updatePhoto=(file)=>{
        setImage(file);
    };
    const deleteProfile = () =>{
        fetch('/deleteuser',{
            method:"DELETE",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:"Some error occured in deletion !", classes:"#f44336 red"});
            }
            else{
                M.toast({html:"Account deleted Successfully !", classes:"#ffa726 orange lighten-1"});
            }
            history.push('/signin');
        })
    };
    return(
        
        <div style={{maxWidth:"550px", margin: "0px auto"}}>
            <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            >
            <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="sign">Edit Profile</h2>
                <input
                    type="text"
                    placeholder="Enter new Name"
                    value = {name}
                    onChange = {(event) => setName(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter new Email"
                    value = {email}
                    onChange = {(event) => setEmail(event.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={()=>handleSubmit()}>
                    Submit
                </button>
                
            </div>
        </div>
            </Modal.Body>
        </Modal>
      
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom:  "1px solid grey"
            }}>

                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                     src = {state?state.pic:"Loading.."}
                     alt = "profile pic"
                     />    
                     <div className="file-field input-field">
                <div style={{marginLeft:"25px"}} className="btn #64b5f6 blue darken-2">
                    <span>Update Pic</span>
                    <input type="file" onChange = {(event) => updatePhoto(event.target
                    .files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                </div> 
                </div>
                
                <div>
                    <h4>{state? state.name : "loading.."}</h4>
                    <h5>{state? state.email : "loading.."}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length: "0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                    <button className="btn waves-effect waves-light #d50000 red accent-4"
                    onClick={()=>deleteProfile()}>
                        Delete!
                    </button>
                    <button className="btn waves-effect waves-light "
                    onClick={()=>handleShow()}>
                          <i className="material-icons">create</i>
                    </button>
                
                </div>
                
            </div>
            
            <div className="gallery">
            
                {
                    (mypics.length!==0)?
                    mypics.map((item) => {
                        return(
                            <img key={item._id} style={{width:"30% ",height:"30% "}} className="item" alt={item.title} src={item.photo}/>
                        );
                    })
                    :
                    <div>
                        <h1><p className="brand-logo" style={{textAlign:"center"}}>Post something to see your photos here...</p></h1>    
                    </div>
                }      
                
            </div>
        </div>
    );
}

export default Profile;