
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import User from './User.jsx';
import Post from './Post.jsx';
import Home from './Home.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="User" element={<User />}/>
        <Route path="Post" element={<Post />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

