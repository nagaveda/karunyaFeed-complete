import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/ResponsiveNavbar';
import './App.css';

import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import {reducer, initialState} from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribedPosts from './components/screens/SubcribedPosts';
import Reset from './components/screens/Reset';
import Newpassword from './components/screens/Newpassword';
import Myposts from './components/screens/Myposts';


export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user){
      dispatch({type: "USER", payload: user});    }
    else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/signin');
      }
      
    }
  }, [])
  return (
    <div style={{marginTop:"100px"}}>
        <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/signin">
          <Signin/>
        </Route>
        <Route exact path="/profile">
          <Profile/>
        </Route> 
        <Route path="/signup">
          <Signup/>
        </Route>   
        <Route path="/create">
          <CreatePost/>
        </Route>
        <Route path="/profile/:userId">
          <UserProfile />
        </Route>  
        <Route path="/mysubposts">
          <SubscribedPosts />
        </Route> 
        <Route exact path="/reset">
          <Reset />
        </Route>
        <Route path="/reset/:token">
          <Newpassword />
        </Route>         
        <Route path="/myposts">
          <Myposts />
        </Route>
        
    </Switch>
    </div>
    
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
