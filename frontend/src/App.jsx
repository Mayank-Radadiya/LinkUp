import './App.css'
import Login from './components/login'

function App() {

  function fetchPosts(){
    fetch("http://localhost:3001/posts",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "My First Post",
        content: "This is the body of my first post",
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
  }

  


  return (
    <>
     <Login/>
     <button onClick={fetchPosts}>Fetch Posts</button>
    </>
  )
}

export default App
