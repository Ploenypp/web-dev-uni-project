import {useState, useEffect, useRef} from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";
import NewPost from '../objects/NewPost.jsx';
import Post from "../objects/Post.jsx";

import "../styles/MainPage.css";

function MainPage () {
    const dummyPosts = [
        {
          title: "The Great Pasta Disaster",
          author: "Marco92",
          timestamp: "1 hour ago",
          content: `I once cooked pasta without realizing I didn't have a colander. I tried using a tennis racket. The pasta escaped. The racket was never the same. My dog is still afraid of spaghetti. Learn from me, my friends.`
        },
        {
          title: "Fun Fact: Bananas are radioactive",
          author: "ScienceSam",
          timestamp: "3 hours ago",
          content: `That’s right! Bananas contain potassium-40, a naturally occurring isotope. You'd have to eat over 10 million bananas at once to get radiation sickness, but still—imagine the smoothie.`
        },
        {
          title: "My cat opened Chrome Dev Tools",
          author: "catdadJS",
          timestamp: "yesterday",
          content: `I left my laptop open for two minutes. My cat stepped on it. Somehow she opened Chrome Dev Tools, edited the DOM, and submitted a blank pull request to my repo. She's now a junior developer at a startup in Berlin.`
        },
        {
          title: "Deep thoughts at 3AM",
          author: "theOwlist",
          timestamp: "last night",
          content: `If humans evolved from monkeys, why are there still bananas? Wait. That’s not right. Anyway, sleep is for the weak. Or the smart. I haven’t decided.`
        },
        {
          title: "Yes, I cried over soup.",
          author: "noodle_empress",
          timestamp: "6 days ago",
          content: `It was a rainy day. I made instant noodles. I dropped them. They splashed. I slipped. My cat judged me. I cried. I remade the noodles and they were glorious. The end.`
        },
        {
          title: "The Duck Conspiracy",
          author: "quacktheory",
          timestamp: "1 week ago",
          content: `Ever seen a baby pigeon? No? Thought so. But ducks? Too many. I think ducks are government spies. Or maybe they're just really judgmental birds. Either way, I'm watching them. Closely.`
        },
        {
          title: "French keyboards are chaos",
          author: "keyboard_trauma",
          timestamp: "2 hours ago",
          content: `I used an AZERTY keyboard for the first time. I tried typing ‘bonjour’ and somehow ended up with ‘bo;jou&’. I wept. My passwords are all ruined. This is my villain origin story.`
        },
        {
          title: "An Ode to My Lost Sock",
          author: "sockpoet",
          timestamp: "3 days ago",
          content: `You were brave, little sock. I saw you go into the washing machine. But you never came out. Did the dryer eat you? Did you escape? Wherever you are, I hope you’re warm.`
        },
        {
          title: "Plants: Silent Judgers",
          author: "leafmealone",
          timestamp: "today",
          content: `I bought a houseplant to feel more responsible. It’s been three weeks. It’s still alive. But it’s judging me. I can feel it. Every time I eat junk food, it leans slightly away from me.`
        },
        {
          title: "Sleep? Never heard of her.",
          author: "caffeine_wizard",
          timestamp: "just now",
          content: `I’ve had 4 cups of coffee. My code compiles but does absolutely nothing. I’m afraid if I sleep, the bugs will win. The bugs are winning. They’re in my dreams now.`
        }
      ];

    const [showWrite, setShowWrite] = useState(false);

    const [writeBtnText, setWriteBtnText] = useState("ouvrir une nouvelle discussion");

    const toggleShowWrite = () => {
        if (showWrite) {
            setShowWrite(false)
            setWriteBtnText("ouvrir une nouvelle discussion");
            
        } else {
            setShowWrite(true)
            setWriteBtnText("annuler");
        }
        console.log(write);
    }

    return(<div className="MainPage">
        <Ribbon />
        <Searchbar />
          <div className="posts">
          <button id="togglewritebtn" type="button" onClick = {toggleShowWrite}>{writeBtnText}</button>

          {showWrite && (
            <div><NewPost /></div>
          )}

          {dummyPosts.map((post, index) => (
            <Post
                key={index}
                title={post.title}
                author={post.author}
                timestamp={post.timestamp}
                content={post.content}
            />))}
          </div>
    </div>)
    
}

export default MainPage;