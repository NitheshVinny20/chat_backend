import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout } from "./firebase/auth";
import Chat from "./chat/chat";
import "./style/app.css";

function App() {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

return (
  <div>
    {/* auth */}
    {!user ? (
      <button onClick={login}>Login with Google</button>
    ) : (
      <div className="user-info">
        <img src={user.photoURL} alt="User Avatar" /><br></br><br></br>
        <div className="user-info-content">
          <p>{user.displayName}</p><br></br>
          <p>{user.email}</p>
        </div><br></br>
        <button onClick={logout}>Logout</button>
      </div>
    )}

    {/* Chat */}
    {user && (
      <div className="chat-container">
        <Chat user={user} />
      </div>
    )}
  </div>
);
}

export default App;
