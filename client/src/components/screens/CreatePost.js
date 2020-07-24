import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(()=> {
        if(url){
            fetch("/createpost", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res => res.json())
            .then(data => {
                if(data.error){
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html:"Posted successfully!", classes:"#1de9b6 teal accent-3"})
                    history.push('/');
                }
            }).catch(err => {
                console.log(err);
            });
        }
        
        
    }, [url]);

    const postDetails = () => {
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
            setUrl(data.url);
        })
        .catch(err => {
            console.log(err);
        });

        
    };

    return(
        <div className="card input-filed" 
        style={{
            margin:"30px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" placeholder="title" 
                value = {title}
                onChange = {(event) => setTitle(event.target.value)}
            />
            <input type="text" placeholder="body" 
                value = {body}
                onChange = {(event) => setBody(event.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-2">
                    <span>Upload Image</span>
                    <input type="file" onChange = {(event) => setImage(event.target
                    .files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-2"
            onClick = {()=>postDetails() }
            >
                Post
            </button>
        </div>
    );
};

export default CreatePost;