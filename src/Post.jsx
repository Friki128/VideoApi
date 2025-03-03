import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";


const post = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("id")
    const [post, setPost] = useState(null)
    const [parts, setParts] = useState([])
    const [comments, setComments] = useState([])
    const [position, setPosition] = useState(0)
    useEffect(() => {
        const fetchPost = async () => {
            setParts([])
            setPosition(0)
            setComments([])
          const fetchedPost = await getPost(id);
          setPost(fetchedPost);
          if (fetchedPost.type == "poll") {
            getBatchPosts(fetchedPost.parts, setParts, 0)
          }
          getBatchPosts(fetchedPost.kids, setComments, position)
          setPosition(pos => pos + 10)
        };
        fetchPost();
      }, [id]);
      

      if (!post) {
        return <h1>Loading...</h1>;
      }

      let Info

      switch(post.type){
        case "story":
            Info = () => <Link to={post.url}>{post.url}</Link>
            break;
        case "poll":
            Info = () => (
                <div>
                  {parts.map((part, index) => {
                    return <p key={index}>{part.text}</p>;
                  })}
                </div>
              );
            break    
        default:
            Info = () => <p>{post.text}</p>
            break
      }

      const loadMore = ()=> {
        getBatchPosts(post.kids, setComments, position)
        setPosition(pos => pos + 10)
      }

      const time = new Date(post.time * 1000).toLocaleString();  
    return (
        <div className="content">
            <h1>{post.title}</h1>
            <p><Link to={`/User?id=${post.by}`}>{post.by}</Link> - {post.score}</p>
            <h2>{post.type} - posted: {time}</h2>
            <Info />
            {comments.map(comment =>{
                return <Link className="comment" to={`/Post?id=${comment.id}`}>{comment.text}</Link>
            })}
            <button onClick={loadMore}>Load More</button>
        </div>
    );
}

export function getPost(id){
    return new Promise((resolve, reject) =>{
        fetch("https://hacker-news.firebaseio.com/v0/item/"+ id +".json?")
       .then((response) => {
       return response.json();
       })
        .then((data) => {
           resolve(data);
       });
    });
}

export async function getBatchPosts(ids, setPosts, position){
    const posts = await Promise.all(ids.slice(position, position+9).map(id => getPost(id)))
    setPosts(prevPosts => prevPosts.concat(posts))
}


export default post;