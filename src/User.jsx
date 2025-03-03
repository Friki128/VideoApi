import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { getBatchPosts } from "./Post.jsx";
 
const user = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("id")
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([]);
    const [position, setPosition] = useState(0)

    

    useEffect(() => {
        const fetchUser = async () => {
          const fetchedUser = await getUser(id);
          setUser(fetchedUser);
          getBatchPosts(fetchedUser.submitted, setPosts, position)
          setPosition(pos => pos + 10)
        };
        fetchUser();
      }, [id]);
    
    const loadMore = ()=> {
      getBatchPosts(user.submitted, setPosts, position)
      setPosition(pos => pos + 10)
    }

      if (!user) {
        return <h1>Loading...</h1>; 
      }
    const time = new Date(user.created * 1000).toLocaleString();  
    return (
        <div className="content">
        <h1>{user.id}</h1>
        <h2>{user.about}</h2>
        <h3>Karma: {user.karma} | Created: {time}</h3>
        <ul>
            {posts.map(post => (
              <li key={post.id}>
                   
                {post.title ? (
                    <Link className="post" to={`/Post?id=${post.id}`}>
                    {post.title}
                    </Link>
                  ) : (
                    <p className="comment">{post.text}</p>
                  )}
              </li>
            ))}
          </ul>
          <button onClick={loadMore}>More</button>
          </div>
    );
}

function getUser(id){
    return new Promise((resolve, reject) =>{
        fetch("https://hacker-news.firebaseio.com/v0/user/"+ id +".json?")
       .then((response) => {
       return response.json();
       })
        .then((data) => {
           resolve(data);
       });
    });
}



export default user;