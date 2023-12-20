import React, { useRef, useEffect, useState } from 'react';
import  Message from './components/Message';
import logo from './logo.svg';
import './App.css';
import { MessageType } from './types/types';
import io, { Socket } from 'socket.io-client';


function App() {

  const chatMessageRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const roomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  });
  
    const [messages, setMessages] = useState<MessageType[]>([
      {userId: 0, logo: logo, username: 'halexrr', message: 'You are a loser', sentTime: new Date(), userLevel: 0},
      {userId: 0, logo: logo, username: 'halexrr', message: 'Hello world', sentTime: new Date(), userLevel: 0},
      {userId: 1, logo: logo, username: 'Bryan', message: 'Hello Alex', sentTime: new Date(), userLevel: 1},
      
      {userId: 0, logo: logo, username: 'halexrr', message: 'You are a loserasdfasdf asdfas fasdf asdf asfs asdfasd fasdf asdfasfasdfa s', sentTime: new Date(), userLevel: 0},
      {userId: 0, logo: logo, username: 'halexrr', message: 'Hello world', sentTime: new Date(), userLevel: 0},
      {userId: 1, logo: logo, username: 'Bryan', message: 'Hello Alex', sentTime: new Date(), userLevel: 1},
      {userId: 0, logo: logo, username: 'halexrr', message: 'You are a loser', sentTime: new Date(), userLevel: 0},
      {userId: 0, logo: logo, username: 'halexrr', message: 'Hello world', sentTime: new Date(), userLevel: 0},
      {userId: 1, logo: logo, username: 'Bryan', message: 'Hello Alex', sentTime: new Date(), userLevel: 1},
      {userId: 0, logo: logo, username: 'halexrr', message: 'You are a loser', sentTime: new Date(), userLevel: 0},
      {userId: 0, logo: logo, username: 'halexrr', message: 'Hello world', sentTime: new Date(), userLevel: 0},
      {userId: 1, logo: logo, username: 'Bryan', message: 'Hello Alex', sentTime: new Date(), userLevel: 1},
    ]);

  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // connect to the server based on the url in the search bar with the port 2553
    const newSocket = io(`${window.location.hostname}:2553`);
    setSocket(newSocket);

    // Close the socket when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);


  const messageText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const chatMessage = e.target.value;
    
    // Change the amount of rows to be chatMessage.length / 30 (30 is the amount of characters per row) + 1
    const rows = Math.floor(chatMessage.length / 30) + 1;
    chatMessageRef.current!.rows = rows;
  }

  const updateUsername = () => {
    const newUsername = usernameRef.current!.value;
    
    if (newUsername.length > 0) {
      socket.emit('updateUsername', newUsername);
    }
  };

  const joinRoom = () => {
    let room = roomRef.current!.value;
    let userName = usernameRef.current!.value;

    if (userName.length <= 0) {
      userName = 'anonymous';
    }
    
    if (room.length <= 0) {
      // Generate a random roomid like a-z[0-9] 6-15 characters long
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 15; i++) {
        room += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }
    
    socket.emit('joinRoom', room);
    socket.emit('updateUsername', userName);
    roomRef.current!.value = room;
    usernameRef.current!.value = userName;
  };

  
  
  const sendMessage = () => {
    // const message = 
  }

  return (
    <div className="App flex justify-center w-full h-screen bg-slate-600">
      <div className='m-auto'>
        <div className='text-left'>
          <div className='flex justify-center mb-2'>
            <p className='mr-2 w-20'>Username:</p>
            <input 
              type="text" 
              name="username" 
              id="username" 
              className='rounded-xl bg-teal-600 hover:bg-teal-400 transition-all duration-300 w-52 pl-2'
              ref={usernameRef}
            />
            <button 
              type="submit" 
              className='bg-blue-500 rounded-2xl ml-2 px-2 py-1 text-sm hover:bg-blue-300 transition-all duration-200 w-20'
              onClick={updateUsername}
            >
                Update
            </button>
          </div>
          <div className='flex justify-center'>
          <p className='mr-2 w-20'>Room id:</p>
            <input 
              type="text" 
              name="room" 
              id="roomid" 
              className='rounded-xl bg-teal-600 hover:bg-teal-400 transition-all duration-300 w-52 pl-2'
              ref={roomRef}
            />
            <button 
              type="submit" 
              className='bg-blue-500 rounded-2xl ml-2 px-2 py-1 text-sm hover:bg-blue-300 transition-all duration-200 w-20'
              onClick={joinRoom}
            >
              Join
            </button>
          </div>
        </div>


        <div className='h-[75vh] border-2 border-teal-600 rounded-2xl mt-4 p-4'>
          <div className='h-full overflow-y-auto' ref={divRef}>
            {messages.map((message, index) => (
              <Message key={index} message = {message} userId={0}/>
            ))}
          </div>
        </div>
        
        <div className='m-4 p-4 rounded-xl w-full grid grid-flow-col place-items-center '>
          <textarea 
            cols={30} 
            rows={1} 
            ref={chatMessageRef}  
            onChange={messageText} 
            className='transition-all duration-300 rounded-lg mr-2 text-left px-2 resize-none focus-within:border-2 bg-teal-600 hover:bg-teal-400'
          />
          
          <div className=''>
            <button 
              type="submit" 
              className='bg-blue-500 rounded-2xl px-2 py-1 text-sm hover:bg-blue-300 transition-all duration-200'
              //onClick={sendMessage}
            >Send 💬</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
