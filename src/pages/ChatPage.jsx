import { useState, useEffect, useRef } from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Message from "../objects/Message.jsx";
import msg_pfp from "../assets/msg_pfp.png";

function ChatPage() {
    const dummyChats = [
        {
          friend: "Beomgyu",
          messages: [
            { author: "Beomgyu", content: "I tried cooking rice in a coffee maker. It exploded." },
            { author: "Me", content: "Did you at least get coffee-flavored rice?" },
            { author: "Beomgyu", content: "No, just a scorched kitchen and regret." },
            { author: "Beomgyu", content: "Bro I just saw a cat doing parkour." },
            { author: "Me", content: "Was it better than you?" },
            { author: "Beomgyu", content: "Sadly yes. I’m questioning my worth now." },
            { author: "Beomgyu", content: "Also it hissed at me when I tried to copy it." },
            { author: "Me", content: "Even the cat knows." },
            { author: "Beomgyu", content: "Okay rude." },
            { author: "Beomgyu", content: "Wanna buy a haunted toaster?" },
            { author: "Me", content: "What." },
            { author: "Beomgyu", content: "It screams when the bread’s ready." },
            { author: "Me", content: "Sounds like you." },
            { author: "Beomgyu", content: "Exactly. It's my soul in appliance form." },
            { author: "Beomgyu", content: "Do you think pigeons hold grudges?" },
            { author: "Me", content: "What did you do." }
          ]
        },
        {
          friend: "Kieran",
          messages: [
            { author: "Kieran", content: "Why do socks disappear in the laundry? Is there a sock portal?" },
            { author: "Me", content: "Absolutely. It’s how gnomes pay rent." },
            { author: "Kieran", content: "I knew it. I *felt* a gnome in my dryer." },
            { author: "Kieran", content: "I tripped on absolutely nothing in front of a very cute barista." },
            { author: "Me", content: "Did you recover with grace?" },
            { author: "Kieran", content: "I said 'floor loves me' and walked away." },
            { author: "Me", content: "Honestly iconic." },
            { author: "Kieran", content: "They laughed. Or cried. I’m not sure." },
            { author: "Me", content: "It's a fine line." }
          ]
        },
        {
          friend: "Lucien",
          messages: [
            { author: "Lucien", content: "I brought a baguette to a sword fight. I lost." },
            { author: "Me", content: "At least you were deliciously brave." },
            { author: "Lucien", content: "They said I was too crusty to win anyway." },{ author: "Lucien", content: "I stared at the moon for too long and now I feel poetic." },
            { author: "Me", content: "Please don’t write me another 4-page ode." },
            { author: "Lucien", content: "Too late. Already halfway done." },
            { author: "Me", content: "Does it involve the word 'ethereal' again?" },
            { author: "Lucien", content: "It's the third word in." },
            { author: "Lucien", content: "Also, I burned my toast while writing this." },
            { author: "Me", content: "The price of artistry." },
            { author: "Lucien", content: "My kitchen smells like smoke and regret." }
          ]
        },
        {
          friend: "Kai",
          messages: [
            { author: "Kai", content: "I waved at someone who wasn’t waving at me again." },
            { author: "Me", content: "That’s the fifth time this week." },
            { author: "Kai", content: "It builds character, okay?" },{ author: "Kai", content: "I made ramen. I am now a chef." },
            { author: "Me", content: "Did you burn water again?" },
            { author: "Kai", content: "That happened once!" },
            { author: "Kai", content: "Okay twice." },
            { author: "Kai", content: "But this time I only set off the fire alarm once!" },
            { author: "Me", content: "Progress?" },
            { author: "Kai", content: "It’s called 'smoked ramen' now." },
            { author: "Me", content: "Didn’t know carcinogens were a garnish." },
            { author: "Kai", content: "I’m hanging up." },
            { author: "Kai", content: "This is a chat I can’t hang up. UGH." },
            { author: "Me", content: "Exactly. Suffer." }
          ]
        },
        {
          friend: "Taehyun",
          messages: [
            { author: "Taehyun", content: "I ironed my shirt while wearing it. Send aloe." },
            { author: "Me", content: "Why would you do that??" },
            { author: "Taehyun", content: "Efficiency. And pain. Mostly pain." },
            { author: "Taehyun", content: "I told the gym guy I wanted to be strong like an anime protagonist." },
            { author: "Me", content: "And?" },
            { author: "Taehyun", content: "He made me run stairs while yelling my goals out loud." },
            { author: "Me", content: "So what did you yell?" },
            { author: "Taehyun", content: "'I want abs and emotional stability!'" },
            { author: "Me", content: "Ambitious." },
            { author: "Taehyun", content: "I almost passed out on the 3rd flight." },
            { author: "Me", content: "The emotional stability or the stairs?" },
            { author: "Taehyun", content: "Yes." }
          ]
        },
        {
          friend: "Yeonjun",
          messages: [
            { author: "Yeonjun", content: "I dreamt I was dancing with a baguette. Again." },
            { author: "Me", content: "You and Lucien should start a bread-based performance group." },
            { author: "Yeonjun", content: "Bread & Butter: the musical." },{ author: "Yeonjun", content: "I just tried to flirt with the barista and accidentally ordered 17 muffins." },
            { author: "Me", content: "You’re a menace." },
            { author: "Yeonjun", content: "She winked at me!" },
            { author: "Me", content: "Was it a wink or was she just blinking?" },
            { author: "Yeonjun", content: "I panicked, okay?" },
            { author: "Yeonjun", content: "My freezer is full of muffins now." },
            { author: "Me", content: "You're going to turn into a muffin." },
            { author: "Yeonjun", content: "Then she’ll HAVE to love me." }
          ]
        },
        {
          friend: "Soobin",
          messages: [
            { author: "Soobin", content: "I tried to pet a squirrel. It stole my granola bar." },
            { author: "Me", content: "Squirrels are just fuzzy criminals." },
            { author: "Soobin", content: "That one had no remorse in its eyes." },{ author: "Soobin", content: "I tried to assemble Ikea furniture without the instructions." },
            { author: "Me", content: "How many extra parts?" },
            { author: "Soobin", content: "Not extra. Mystery. Possibly cursed." },
            { author: "Me", content: "Is the furniture standing?" },
            { author: "Soobin", content: "Technically, yes. Emotionally, no." },
            { author: "Soobin", content: "I think it's judging me." },
            { author: "Me", content: "Probably. I am too." },
            { author: "Soobin", content: "Thanks for the support." },
            { author: "Me", content: "Anytime." },
            { author: "Soobin", content: "It just fell over. I think it's crying." }
          ]
        },
        {
          friend: "Ren",
          messages: [
            { author: "Ren", content: "I bought 50 rubber ducks. I regret nothing." },
            { author: "Me", content: "What… prompted that?" },
            { author: "Ren", content: "Quack therapy." },
            { author: "Ren", content: "I just realized I’ve been using my roommate’s toothbrush for a week." },
            { author: "Me", content: "Oh no." },
            { author: "Ren", content: "They’re going to kill me." },
            { author: "Ren", content: "Should I fake my own death?" },
            { author: "Me", content: "Only if you leave a dramatic letter behind." },
            { author: "Ren", content: "‘Dearest, I have fallen to oral hygiene betrayal. Forgive me.’" }
          ]
        },
        {
          friend: "Cassian",
          messages: [
            { author: "Cassian", content: "I challenged a mime to a staring contest. I lost." },
            { author: "Me", content: "You lost to a mime?" },
            { author: "Cassian", content: "He blinked with power. I wasn’t ready." }
          ]
        },
        {
          friend: "Ethan",
          messages: [
            { author: "Ethan", content: "I asked Siri if she loved me. She said she respects me." },
            { author: "Me", content: "Ouch. That’s a soft rejection." },
            { author: "Ethan", content: "Even my AI crush is emotionally unavailable." }
          ]
        },{
          friend: "Alex",
          messages: [
            { author: "Alex", content: "I hacked into my own fridge just to test my skills." },
            { author: "Me", content: "You need a hobby." },
            { author: "Alex", content: "That *is* my hobby." },
            { author: "Me", content: "Did you find anything?" },
            { author: "Alex", content: "Expired yogurt. It glowed." },
            { author: "Me", content: "That's a biohazard now." },
            { author: "Alex", content: "I named it Fred." }
          ]
        },
        {
          friend: "Ryujin",
          messages: [
            { author: "Ryujin", content: "I challenged a seagull for my fries. I lost." },
            { author: "Me", content: "Should I send backup?" },
            { author: "Ryujin", content: "It's sitting on my car now. I think it won the war." },
            { author: "Ryujin", content: "It has no fear. Or mercy." },
            { author: "Me", content: "Send help?" },
            { author: "Ryujin", content: "Send fries." }
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
    useEffect(() => {
        console.log("current chat selected : ",chatSelected);
    }, [chatSelected]);

    const currentChat = dummyChats.find(chat => chat.friend === chatSelected);

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
                        {currentChat && currentChat.messages.map((msg,index) => (<Message key={index} pfp={msg_pfp} author={msg.author} content={msg.content} />))}
                    </div>)
                }
                {chatSelected === "none" ? (<div></div>) : (<div id="new_msg">
                    <input id="new_msg_text" type="text"/>
                    <button id="send_msg_btn" type="button">→</button>
                </div>) }
            </div>
        </div>
    </div>)
}

export default ChatPage;