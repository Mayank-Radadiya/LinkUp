import "./App.css";
import Login from "./components/Login";
import axios from "axios";

function App() {
  async function fetchPosts() {
    try {
      const response = await axios.post(
        "http://localhost:3001/posts",
        {
          credentials: "include",
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Login />
      <button onClick={fetchPosts}>Fetch Posts</button>
    </>
  );
}

export default App;
