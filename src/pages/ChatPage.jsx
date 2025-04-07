import { useState, useEffect, useRef } from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Message from "../objects/Message.jsx";
import msg_pfp from "../assets/msg_pfp.png";

function ChatPage() {
    const dummyChats = [
        {
          friend: "Beomgyu",
          messages: [
            { author: "Beomgyu", content: "I tried cooking rice in a coffee maker. It exploded.", type:"other" },
            { author: "Me", content: "Did you at least get coffee-flavored rice?", type:"self" },
            { author: "Beomgyu", content: "No, just a scorched kitchen and regret.", type:"other" },
            { author: "Beomgyu", content: "Bro I just saw a cat doing parkour.", self:"other" },
            { author: "Me", content: "Was it better than you?", type:"self" },
            { author: "Beomgyu", content: "Sadly yes. I’m questioning my worth now.", self:"other" },
            { author: "Beomgyu", content: "Also it hissed at me when I tried to copy it.", self:"other" },
            { author: "Me", content: "Even the cat knows.", type:"self" },
            { author: "Beomgyu", content: "Okay rude.", self:"other" },
            { author: "Beomgyu", content: "Wanna buy a haunted toaster?", self:"other" },
            { author: "Me", content: "What.", type:"self" },
            { author: "Beomgyu", content: "It screams when the bread’s ready.", self:"other" },
            { author: "Me", content: "Sounds like you.", type:"self" },
            { author: "Beomgyu", content: "Exactly. It's my soul in appliance form.", self:"other" },
            { author: "Beomgyu", content: "Do you think pigeons hold grudges?", self:"other" },
            { author: "Me", content: "What did you do.", type:"self" }
          ]
        },
        {
          friend: "Kieran",
          messages: [
            { author: "Kieran", content: "Why do socks disappear in the laundry? Is there a sock portal?", self:"other" },
            { author: "Me", content: "Absolutely. It’s how gnomes pay rent.", type:"self" },
            { author: "Kieran", content: "I knew it. I *felt* a gnome in my dryer.",self:"other" },
            { author: "Kieran", content: "I tripped on absolutely nothing in front of a very cute barista.", self:"other" },
            { author: "Me", content: "Did you recover with grace?", type:"self" },
            { author: "Kieran", content: "I said 'floor loves me' and walked away.", self:"other" },
            { author: "Me", content: "Honestly iconic.", type:"self" },
            { author: "Kieran", content: "They laughed. Or cried. I’m not sure.", self:"other" },
            { author: "Me", content: "It's a fine line.", type:"self" }
          ]
        },
        {
          friend: "Lucien",
          messages: [
            { author: "Lucien", content: "I brought a baguette to a sword fight. I lost.", self:"other" },
            { author: "Me", content: "At least you were deliciously brave.", type:"self" },
            { author: "Lucien", content: "They said I was too crusty to win anyway.", self:"other" },
            { author: "Lucien", content: "I stared at the moon for too long and now I feel poetic.", self:"other" },
            { author: "Me", content: "Please don’t write me another 4-page ode.", type:"self" },
            { author: "Lucien", content: "Too late. Already halfway done.", self:"other" },
            { author: "Me", content: "Does it involve the word 'ethereal' again?", type:"self" },
            { author: "Lucien", content: "It's the third word in.", self:"other" },
            { author: "Lucien", content: "Also, I burned my toast while writing this.", self:"other" },
            { author: "Me", content: "The price of artistry.", type:"self" },
            { author: "Lucien", content: "My kitchen smells like smoke and regret.", self:"other" }
          ]
        },
        {
          friend: "Kai",
          messages: [
            { author: "Kai", content: "I waved at someone who wasn’t waving at me again.", self:"other" },
            { author: "Me", content: "That’s the fifth time this week.", type:"self" },
            { author: "Kai", content: "It builds character, okay?" },{ author: "Kai", content: "I made ramen. I am now a chef.", self:"other" },
            { author: "Me", content: "Did you burn water again?", type:"self" },
            { author: "Kai", content: "That happened once!", self:"other" },
            { author: "Kai", content: "Okay twice.", self:"other" },
            { author: "Kai", content: "But this time I only set off the fire alarm once!", self:"other" },
            { author: "Me", content: "Progress?", type:"self" },
            { author: "Kai", content: "It’s called 'smoked ramen' now.", self:"other" },
            { author: "Me", content: "Didn’t know carcinogens were a garnish.", type:"self" },
            { author: "Kai", content: "I’m hanging up.", self:"other" },
            { author: "Kai", content: "This is a chat I can’t hang up. UGH.", self:"" },
            { author: "Me", content: "Exactly. Suffer.", type:"self" }
          ]
        },
        {
          friend: "Taehyun",
          messages: [
            { author: "Taehyun", content: "I ironed my shirt while wearing it. Send aloe.", self:"other" },
            { author: "Me", content: "Why would you do that??", type:"self" },
            { author: "Taehyun", content: "Efficiency. And pain. Mostly pain.", self:"other" },
            { author: "Taehyun", content: "I told the gym guy I wanted to be strong like an anime protagonist.", self:"other" },
            { author: "Me", content: "And?", type:"self" },
            { author: "Taehyun", content: "He made me run stairs while yelling my goals out loud.", self:"other" },
            { author: "Me", content: "So what did you yell?", type:"self" },
            { author: "Taehyun", content: "'I want abs and emotional stability!'", self:"other" },
            { author: "Me", content: "Ambitious.", type:"self" },
            { author: "Taehyun", content: "I almost passed out on the 3rd flight.", self:"other" },
            { author: "Me", content: "The emotional stability or the stairs?", type:"self" },
            { author: "Taehyun", content: "Yes.", self:"other" }
          ]
        },
        {
          friend: "Yeonjun",
          messages: [
            { author: "Yeonjun", content: "I dreamt I was dancing with a baguette. Again.", self:"other" },
            { author: "Me", content: "You and Lucien should start a bread-based performance group.", type:"self" },
            { author: "Yeonjun", content: "Bread & Butter: the musical.", self:"other" },
            { author: "Yeonjun", content: "I just tried to flirt with the barista and accidentally ordered 17 muffins.", self:"other" },
            { author: "Me", content: "You’re a menace.", type:"self" },
            { author: "Yeonjun", content: "She winked at me!", self:"other" },
            { author: "Me", content: "Was it a wink or was she just blinking?", type:"self" },
            { author: "Yeonjun", content: "I panicked, okay?", self:"other" },
            { author: "Yeonjun", content: "My freezer is full of muffins now.", self:"other" },
            { author: "Me", content: "You're going to turn into a muffin.", type:"self" },
            { author: "Yeonjun", content: "Then she’ll HAVE to love me.", self:"other" }
          ]
        },
        {
          friend: "Soobin",
          messages: [
            { author: "Soobin", content: "I tried to pet a squirrel. It stole my granola bar.", self:"other" },
            { author: "Me", content: "Squirrels are just fuzzy criminals.", type:"self" },
            { author: "Soobin", content: "That one had no remorse in its eyes.", self:"other" },
            { author: "Soobin", content: "I tried to assemble Ikea furniture without the instructions.", self:"other" },
            { author: "Me", content: "How many extra parts?", type:"self" },
            { author: "Soobin", content: "Not extra. Mystery. Possibly cursed.", self:"other" },
            { author: "Me", content: "Is the furniture standing?", type:"self" },
            { author: "Soobin", content: "Technically, yes. Emotionally, no.", self:"other" },
            { author: "Soobin", content: "I think it's judging me.", self:"other" },
            { author: "Me", content: "Probably. I am too.", type:"self" },
            { author: "Soobin", content: "Thanks for the support.", self:"other" },
            { author: "Me", content: "Anytime.", type:"self" },
            { author: "Soobin", content: "It just fell over. I think it's crying.", self:"other" }
          ]
        },
        {
          friend: "Ren",
          messages: [
            { author: "Ren", content: "I bought 50 rubber ducks. I regret nothing.", self:"other" },
            { author: "Me", content: "What… prompted that?", type:"self" },
            { author: "Ren", content: "Quack therapy.", self:"other" },
            { author: "Ren", content: "I just realized I’ve been using my roommate’s toothbrush for a week.", self:"other" },
            { author: "Me", content: "Oh no.", type:"self" },
            { author: "Ren", content: "They’re going to kill me.", self:"other" },
            { author: "Ren", content: "Should I fake my own death?", self:"other" },
            { author: "Me", content: "Only if you leave a dramatic letter behind.", type:"self" },
            { author: "Ren", content: "‘Dearest, I have fallen to oral hygiene betrayal. Forgive me.’", self:"other" }
          ]
        },
        {
          friend: "Cassian",
          messages: [
            { author: "Cassian", content: "I challenged a mime to a staring contest. I lost.", self:"other" },
            { author: "Me", content: "You lost to a mime?", type:"self" },
            { author: "Cassian", content: "He blinked with power. I wasn’t ready.", self:"other" }
          ]
        },
        {
          friend: "Ethan",
          messages: [
            { author: "Ethan", content: "I asked Siri if she loved me. She said she respects me.", self:"other" },
            { author: "Me", content: "Ouch. That’s a soft rejection.", type:"self" },
            { author: "Ethan", content: "Even my AI crush is emotionally unavailable.", self:"other" }
          ]
        },{
          friend: "Alex",
          messages: [
            { author: "Alex", content: "I hacked into my own fridge just to test my skills.", self:"other" },
            { author: "Me", content: "You need a hobby.", type:"self" },
            { author: "Alex", content: "That *is* my hobby.", self:"other" },
            { author: "Me", content: "Did you find anything?", type:"self" },
            { author: "Alex", content: "Expired yogurt. It glowed.", self:"other" },
            { author: "Me", content: "That's a biohazard now.", type:"self" },
            { author: "Alex", content: "I named it Fred.", self:"other" }
          ]
        },
        {
          friend: "Ryujin",
          messages: [
            { author: "Ryujin", content: "I challenged a seagull for my fries. I lost.", self:"other" },
            { author: "Me", content: "Should I send backup?", type:"self" },
            { author: "Ryujin", content: "It's sitting on my car now. I think it won the war.", self:"other" },
            { author: "Ryujin", content: "It has no fear. Or mercy.", self:"other"},
            { author: "Me", content: "Send help?", type:"self" },
            { author: "Ryujin", content: "Send fries.", self:"other" }
          ]
        }
    ];

    const [toggleChat, setToggleChat] = useState("inactive");

    const [chatSelected, setChatSelected] = useState("none");
    const selectChat = (name) => {
        const chatName = name;
        if (chatSelected === chatName) {
            setChatSelected("none");
            setToggleChat("inactive");
        } else {
            setChatSelected(chatName);
            setToggleChat("active");
        }
    }

    const currentChat = dummyChats.find(chat => chat.friend === chatSelected);

    const [message,setMessage] = useState("");
    const getMessage = (evt) => { setMessage(evt.target.value); }

    useEffect(() => {
      console.log(`
      current chat selected : ${chatSelected}
      message : ${message}
      `);
  }, [chatSelected,message]);

    return(<div className="ChatPage">
        <Ribbon />
        <div id="chatpage_subcontainer">
            <div id="chat_sidebar">
                Messages 
                <div id="chat_lst">
                    {dummyChats.map((chat,index) => <button key={index} id="chat_btn" type="button" onClick={() => selectChat(chat.friend)}>{chat.friend}</button>)}
                </div>
            </div>
            <div id="chat_area">
                {chatSelected === "none" ? (<div id="chat_placeholder">selectionner un chat...</div>) : 
                    (<div id="msg_lst">
                        {currentChat && currentChat.messages.map((msg,index) => (<Message key={index} type={msg.type} pfp={msg_pfp} author={msg.author} content={msg.content} />))}
                    </div>)
                }
                {chatSelected === "none" ? (<div></div>) : (<div id="new_msg">
                    <input id="new_msg_text" type="text" onChange={getMessage} placeholder="écrivez..."/>
                    <button id="send_msg_btn" type="button">→</button>
                </div>) }
            </div>
        </div>
    </div>)
}

export default ChatPage;