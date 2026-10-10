import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebase";
import { dbx } from "./dropbox";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user
  } = useAuth0();

  async function register() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Registration successful");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function selectFile(event) {
    setFile(event.target.files[0]);
  }
  async function uploadFile() {
    if (file === null) {
      setMessage("Please select a file");
      return;
    }
    try {
      await dbx.filesUpload({
        path: "/" + file.name,
        contents: file
      });

      setMessage("File uploaded to Dropbox successfully");
    } catch (error) {
      console.log(error);
      setMessage("File upload failed");
    }
  }

  async function saveToMongoDB() {
    try {
      const response = await fetch(
        "http://localhost:5000/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            fileName: file ? file.name : ""
          })
        }
      );

      const result = await response.text();

      setMessage(result);
    } catch (error) {
      console.log(error);
      setMessage("MongoDB save failed");
    }
  }

  return (
    <div>
      <h1>Cloud File App</h1>

      <h2>Firebase Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={register}>
        Register
      </button>

      {" "}

      <button onClick={login}>
        Login
      </button>

      <hr />

      <h2>Dropbox File Upload</h2>

      <input
        type="file"
        onChange={selectFile}
      />

      <br />
      <br />

      <button onClick={uploadFile}>
        Upload File
      </button>

      <hr />

      <h2>MongoDB Atlas</h2>

      <button onClick={saveToMongoDB}>
        Save to MongoDB
      </button>

      <hr />

      <h2>Auth0 Login</h2>

      {isAuthenticated ? (
        <div>
          <h3>Welcome {user.name}</h3>

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin
                }
              })
            }
          >
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Login with Auth0
        </button>
      )}

      <h3>{message}</h3>
    </div>
  );
}

export default App;