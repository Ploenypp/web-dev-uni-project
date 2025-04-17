import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/ProfilePage.css";
import "../styles/Chat.css";

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx"
import Post from "../objects/Post.jsx"
import ProfileInfo from "../objects/ProfileInfo";
import RequestLst from "../objects/RequestLst.jsx";

function ProfilePage() {
    const dummyPosts = [
        {
          title: "The Egg Incident",
          author: "Axelle Delacroix",
          timestamp: "2 hours ago",
          content: "So I tried cracking an egg with one hand like the cool chefs do and it ended up on the floor, the counter, my shirt, and somehow in my hair. 0/10 would not recommend without practice. RIP breakfast."
        },
        {
          title: "Keyboard Crumbs",
          author: "Axelle Delacroix",
          timestamp: "Yesterday",
          content: "I cleaned my keyboard today and found what could only be described as an entire ecosystem. There was a sesame seed under the 'G' key. I haven’t had a sesame bagel in months. Who’s responsible for this??? (It's me. I'm responsible.)"
        },
        {
          title: "The Great Pasta Spill",
          author: "Axelle Delacroix",
          timestamp: "3 days ago",
          content: "Was cooking pasta. Tried to be fancy and toss it in the pan like they do on TikTok. Half the pasta landed back in the pan. The other half is now a crunchy floor garnish. My cat is delighted."
        },
        {
          title: "Phantom Notifications",
          author: "Axelle Delacroix",
          timestamp: "Last week",
          content: "Does anyone else hear the *phantom ping*? That faint imaginary notification sound that makes you check your phone for absolutely no reason? I think my brain is trying to gaslight me. Rude."
        },
        {
          title: "Tomato Soup Chaos",
          author: "Axelle Delacroix",
          timestamp: "2 weeks ago",
          content: "Decided to make tomato soup from scratch. Accidentally doubled the garlic. Burned my tongue. Added cream to cool it down. Forgot lactose intolerance. Would I do it again? Probably. But I’d regret it less if I wore gloves while chopping chili."
        },
        {
          title: "Night Owl Strikes Again",
          author: "Axelle Delacroix",
          timestamp: "2:47 AM",
          content: "Why do I suddenly feel the urge to reorganize my closet at nearly 3 in the morning? My productivity makes no sense and I fear this is becoming a lifestyle. Send snacks. And maybe a nap schedule."
        },
        {
          title: "Caught Singing in Public",
          author: "Axelle Delacroix",
          timestamp: "1 month ago",
          content: "Had headphones in. Thought I was humming quietly. Apparently I was full-volume belting out a dramatic anime opening in the supermarket. Someone applauded. Not sure if it was sarcastic or sincere. Still bowed. No regrets."
        }
    ];
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    const toChats = () => {
      navigate("/chats");
    }

    useEffect(() => {
      fetch('http://localhost:8000/api/posts/profile-posts', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { 
          console.log(data)
          if (Array.isArray(data)) { setPosts(data); } 
          else { setPosts([]); }
        })

        .catch(err=> console.error("Error fetching user posts", err));
    }, []);

    return(<div className="ProfilePage">
        <Ribbon />
        <div id="pf_container">
            <div id="profile_sidebar"> 
              <ProfileInfo /> <RequestLst /> 
              <button id="redirChat_btn" type="button" onClick={toChats}>Messages</button>
            </div>
            <div id="pf_subcontainer">
              <Searchbar />
              <div id="profile_posts">
              <div className="posts">
              {posts.map((post, index) => (
                <Post
                  key={index}
                  title={post.title}
                  author={post.author}
                  timestamp={post.timestamp}
                  content={post.content}
                />
              ))}
              </div>
            </div>
            </div>
        </div>
    </div>)
}

export default ProfilePage;