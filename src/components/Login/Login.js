import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { handleGoogleSignIn, initializeLoginFramework,handleSignOut, handleFBLogin, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './LoginManager';


function Login() {
  const[newUser,setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignedIn : false, 
    name: '', 
    email: '',
    password: '',
    photo: ''
  });

initializeLoginFramework();
  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res,true);
      } )
  }

  const fbLogin = () => {
    handleFBLogin()
    .then(res => {
      handleResponse(res,true);     } )
  }

  const signOut = () => {
    handleSignOut()
    .then (res => {
     handleResponse(res,false);
    })
  }

  const handleResponse = (res,redirect) => {
    
      setUser(res);
      setLoggedInUser(res);
      if(redirect){
        history.replace(from);
      }
    
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
       isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if(event.target.name=== 'password'){
      const isPasswordValid = event.target.value.length >6;
      const passwordHasNumber = /\d{1}/.test(event.target.value)
    isFieldValid =  isPasswordValid && passwordHasNumber;
    }
    //update user info if true
    if(isFieldValid){
        const newUserInfo = {...user};
        newUserInfo[event.target.name]= event.target.value;
        setUser(newUserInfo);
      
    }

  }
  const handleSubmit = (event) => {
 //   console.log(user.email,user.password)
    if (newUser &&  user.email && user.password){
      createUserWithEmailAndPassword(user.name,user.email,user.password)
      .then(res => {
        handleResponse(res,true);
      })
    }
    if(!newUser && user.email && user.password){
       signInWithEmailAndPassword(user.email,user.password)
       .then(res => {
        handleResponse(res,true);
      })
    }
    event.preventDefault();

  }
  

  return (
    <div style={{textAlign:'center'}}>
     {
       user.isSignedIn?  <button onClick={signOut}>Sign Out</button> :
       <button onClick={googleSignIn}>Sign in</button>}
       <br/>
       <button onClick={fbLogin}>Sign in using Facebook</button>
     {
       user.isSignedIn && <div> <p>Welcome {user.name}</p>
       <p>Your email: {user.email}</p>
       <img src={user.photo} alt=""/>
        </div>
     }
 
    <h1> Our Own Authentication</h1>
    <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">New User Sign Up</label>
    <form onSubmit={handleSubmit}>
    {newUser && <input name="name"  onBlur={handleBlur} placeholder="Your name" type="text"/>}
    <br/>
     <input type="text" onBlur={handleBlur} name="email" placeholder="Your email address" required />
     <br/>
     <input type="password" onBlur={handleBlur} name="password" placeholder="6 digit password" required/>
     <br/>
     <input type="submit" value={newUser? 'Sign up' : 'Sign in'}/>
    </form>
    <p style={{color:"red"}}>{user.error}</p>
    {user.success &&  <p style={{color:"green"}}>User {newUser?'Created': 'Logged In'} Successfully</p> }
    </div>
  );
}

export default Login;
