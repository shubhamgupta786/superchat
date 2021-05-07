//npimport logo from './logo.svg';
import './App.css';
//import 'emoji-mart/css/emoji-mart.css'
//import { Picker } from 'emoji-mart'
//import Picker from 'emoji-picker-react';
import React,{useState,useRef} from 'react';
import firebase from 'firebase/app'
import  'firebase/storage';
import  'firebase/firestore';
import 'firebase/auth';
//import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp(
  // your config
   {
    apiKey: "AIzaSyBTLfGXusJVR8Z4l8R91JVx3VIwpWmobZM",
    authDomain: "superchat-3d165.firebaseapp.com",
    projectId: "superchat-3d165",
    storageBucket: "superchat-3d165.appspot.com",
    messagingSenderId: "235692471381",
    appId: "1:235692471381:web:adbb64fbe160a693b4d0dc"
   }
)
const auth=firebase.auth();
const firestore=firebase.firestore();
//const analytics=firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="wrapper">
      <h1>⚛️🔥💬Messenger</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(300);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🐦</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt= ' ' />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
