
import './App.css';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


function App() {
  const [newUser,setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSigned: false,
    name: "",
    email: "",
    password:"",
    photo: '',
    error: '',
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const signInHandler = () => {
    firebase.auth().signInWithPopup(provider)
      .then((res) => {
        let credential = res.credential;
        const token = credential.accessToken;
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSigned: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser)
      }).catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
      });
  }
  const signOutHandler = () => {

    firebase.auth().signOut()
      .then(() => {
        const signedOutUser = {
          isSigned: false,

        }
        setUser(signedOutUser)
      }).catch((error) => {
        // An error happened.
      });
  }
  const handleSubmit = (event) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const submitMessage = {...user} ;
         submitMessage.error = <p style={{color:'green'}}>You are successfully signed up </p>;
        setUser(submitMessage)
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        const submitMessage = {...user} ;
         submitMessage.error = <p style={{color:'red'}}>{errorMessage}</p>;
        setUser(submitMessage)
        
  
        // ..
      }); 
    }
    else if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    const submitMessage = {...user} ;
         submitMessage.error = <p style={{color:'green'}}>You are successfully logged in </p>;
        setUser(submitMessage)
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    const submitMessage = {...user} ;
    submitMessage.error = <p style={{color:'red'}}>{errorMessage}</p>;
   setUser(submitMessage)
  });
    }
    event.preventDefault();
  }
  const handleBlur = (event) => {
   let isFieldValid = true ;
    if(event.target.name ==='email'){
       isFieldValid = /\S+@\S+\.\S+/.test(event.target.value)

    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

 console.log(user.error);
  return (
    <div className="App">
      {
        user.isSigned ? <button onClick={signOutHandler} className="btn btn-warning"> Sign Out </button> : <button onClick={signInHandler} className="btn btn-warning">Sign In</button>


      }
      {
        user.isSigned &&
        <div>
          <p> Welcome,{user.name} </p>
          <p>mail: {user.email}</p>
          <img style={{ width: '100%', height: '100px', objectFit: 'contain' }} src={user.photo} alt="" />


        </div>
      }
      <h1>Our own authentication</h1>
      <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser"> New user sign Up </label>
      <br/>
      <form onSubmit={handleSubmit} >
     {newUser &&
      <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name" required />
     }
        <br />
        <input type="email" name="email" onBlur={handleBlur} placeholder="give your mail" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="set your password" required />
        <br />
        
        <input type="submit" value="Submit" />
      </form>
      {user.error}

    </div>
  );
}

export default App;
