import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom'; 
import M from 'materialize-css';
const Reset = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const postData = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            M.toast({html:"Invalid email", classes:"#c62828 red darken-3"});
            return;
        }
        fetch("/reset-password", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: email,
            })
            
        }).then(res => res.json())
        .then((data) => {
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"});
            }
            else{
                M.toast({html:data.message, classes:"#1de9b6 teal accent-3"})
                history.push('/signin');
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="sign">Karunya Feed</h2>
                <input
                    type="text"
                    placeholder="email"
                    value = {email}
                    onChange = {(event) => setEmail(event.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2"
                onClick = {()=>postData()}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
}

export default Reset;