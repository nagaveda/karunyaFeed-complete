import React, {useContext, useState, useRef, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import {NavLink} from 'react-router-dom';
import {Navbar, NavbarBrand,Nav,NavbarToggler,Collapse,NavItem, Jumbotron, Modal, ModalBody, ModalHeader, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import M from 'materialize-css';

const NavBar = () => {
  const [isNavOpen, setisNavOpen] = useState(false);
  const {state, dispatch} = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const history = useHistory();
  const searchModal = useRef(null);
  useEffect(()=>{
    M.Modal.init(searchModal.current);
  }, []);

  const handleClick = () => {
    if(count !== 0){
      setisNavOpen(!isNavOpen);
    }
  }; 
  const renderBtn = () => {
    if(state){
      return(
        <Nav navbar>
            <NavItem>
                <Button outline 
                    onClick = {()=>{
                  localStorage.clear();
                  dispatch({type: "CLEAR"});
                  history.push('/signin');
                }}>
                    Sign out
                </Button>
            </NavItem>
        </Nav> 
      );
    }
  }
  const renderList = () => {
    if(state){
      return (
        <Nav navbar>
          <NavItem>
              <NavLink onClick={()=>handleClick()} className="nav-link" to="/">EXPLORE</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={()=>handleClick()} className="nav-link" to="/profile">PROFILE</NavLink>
          </NavItem>
          <NavItem>
              <NavLink onClick={()=>handleClick()} className="nav-link" to="/mysubposts">SUBSCRIBED POSTS</NavLink>
          </NavItem>
          <NavItem>
              <NavLink onClick={()=>handleClick()} className="nav-link" to="/myposts">MY POSTS</NavLink>
          </NavItem>
          <NavItem>
              <NavLink onClick={()=>handleClick()} className="nav-link" to="/create">POST</NavLink>
          </NavItem>
          <NavItem style={{marginTop:"12px"}}>
              <i onClick={()=>handleClick()} data-target="modal" className="large material-icons modal-trigger" style={{color:"black"}}>search</i>
          </NavItem>
        </Nav>
          
      );
    }
    else{
     return(
      <>
        <NavItem>
              <NavLink onClick={()=>handleClick()} className="nav-link" to="/signin">SIGN IN</NavLink>
        </NavItem>
        <NavItem>
              <NavLink onClick={()=>handleClick()} className="nav-link" to="/signup">SIGN UP</NavLink>
        </NavItem>
        
      </>
     );
    }
  };
  
  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method:"POST",
      headers: {
        "Authorization":"Bearer " + localStorage.getItem("jwt"),
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        query
      })
    })
    .then(res=>res.json())
    .then(results => {
      setUsers(results.user);
    })
  };
  return(
    <Navbar  fixed="top"  dark expand="md">                  
      <NavbarToggler onClick={()=>{
        setCount(count=>count+1);
        setisNavOpen(!isNavOpen);
        }}/>
      <NavbarBrand className="mr-auto mylogo" href={state?"/":"/signin"}>Karunya Feed</NavbarBrand>
      <Collapse style={isNavOpen?{backgroundColor:"#EA7773", padding:"20px", borderRadius:"5px", opacity:"95%"}:{backgroundColor:"none"}} isOpen={isNavOpen} navbar>
          <Nav navbar>
          {renderList()}
          </Nav>
          <Nav className="ml-auto" navbar>
          {renderBtn()}
          </Nav>
      </Collapse>
      <div id="modal" className="modal" ref={searchModal} style={{color:"black", overflow:"auto"}}>
        <div className="modal-header">
        <input type="text" placeholder="search users" value = {search}
          onChange = {(event) => fetchUsers(event.target.value)}
          />
          </div>
          <div className="modal-content">
          <ul className="collection">
            {users.map((item) => {
              return (
               <Link to={"/profile/"+item._id} 
               onClick={()=>{
                 M.Modal.getInstance(searchModal.current).close();
                 setSearch('');
                 }}>
                  <li className="collection-item"><img alt={`${item.name} pic`} width="35px" height="35px" style={{borderRadius:"20px"}} src={item.pic}></img>  {item.email}</li>
               </Link> 
              )
            })}
            
          </ul>

        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick = {()=>setSearch('')}>close</button>
        </div>
      </div>
   </Navbar>
    
    );

};

export default NavBar;
