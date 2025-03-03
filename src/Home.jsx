import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getBatchPosts } from "./Post.jsx";

const home = () => {
    const [list, setList] = useState(null);
    const [posts, setPosts] = useState([]);
    const [position, setPosition] = useState(0)
    const [type, setType] = useState("top")

    useEffect(() => {
        const fetchList = async () => {
          setPosts([])
          setPosition(0)
          const fetchedList = await getPostList(type);
          setList(fetchedList);
          getBatchPosts(fetchedList, setPosts, position)
          setPosition(pos => pos + 10)
        };
        fetchList();
      }, [type]);
    
    const loadMore = ()=> {
      getBatchPosts(list, setPosts, position)
      setPosition(pos => pos + 10)
    }

    const reload = (event)=>{
        setType(event.target.value)
    }

      if (!posts) {
        return <h1>Loading...</h1>;
      }

      return (
        <div className="content">
            <select name="type" id="type" onChange={reload}>
                <option value="top">Top</option>
                <option value="best">Best</option>
                <option value="new">New</option>
            </select>
            {posts.map(post =>{
                return <Link className="post" to={`/Post?id=${post.id}`}>{post.title}</Link>
            })}

            <button onClick={loadMore}>Load More</button>
        </div>
      )

}


function getPostList(type){
    return new Promise((resolve, reject) =>{
        fetch("https://hacker-news.firebaseio.com/v0/"+ type +"stories.json")
       .then((response) => {
       return response.json();
       })
        .then((data) => {
           resolve(data);
       });
    });
}

export default home