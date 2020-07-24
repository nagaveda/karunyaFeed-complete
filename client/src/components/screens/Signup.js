import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url, setUrl] = useState("https://res.cloudinary.com/nagaveda999/image/upload/v1594638348/images_ughhmp.png");
    useEffect(()=>{
        if(url){
            uploadfields();
        }
    }, [url]);
    const uploadPic = () => {
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
    const uploadfields = () =>{
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            M.toast({html:"Invalid email ", classes:"#c62828 red darken-3"});
            return;
        }
        fetch("/signup", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name:name,
                password: password,
                email: email,
                pic:url
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.message, classes:"#1de9b6 teal accent-3"})
                history.push('/signin');
            }
        }).catch(err => {
            console.log(err);
        });
    };
    const postData = () => {
        if(image){
            uploadPic();
        }
        else{
            uploadfields();
        }
       
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="sign">Karunya Feed</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value = {name}
                    onChange={(event)=>setName(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="email"
                    value = {email}
                    onChange={(event)=>setEmail(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value = {password}
                    onChange={(event)=>setPassword(event.target.value)}
                />
                <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-2">
                    <span>Upload Pic</span>
                    <input type="file" onChange = {(event) => setImage(event.target
                    .files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2"
                onClick={()=>postData()}
                >
                    Sign up
                </button>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signup;