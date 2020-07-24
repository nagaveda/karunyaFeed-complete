import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom'; 
import M from 'materialize-css';
import {UserContext} from '../../App';
const Signin = () => {
    const {state, dispatch} = useContext(UserContext);    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const postData = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            M.toast({html:"Invalid email", classes:"#c62828 red darken-3"});
            return;
        }
        fetch("/signin", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password                
            })
        }).then(res => res.json())
        .then((data) => {
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"});
            }
            else{
                console.log("Test1", data);
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("userId",data.user._id);
                dispatch({type: "USER", payload: data.user});
                M.toast({html:"Signed in successfully!", classes:"#1de9b6 teal accent-3"})
                history.push('/');
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
                <input
                    type="password"
                    placeholder="password"
                    value = {password}
                    onChange = {(event) => setPassword(event.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2"
                onClick = {()=>postData()}
                >
                    Sign in
                </button>
                <h5>
                    <Link to="/signup">Dont have an account ?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Forgot Password ?</Link>
                </h6>
            </div>
        </div>
    );
}

export default Signin;