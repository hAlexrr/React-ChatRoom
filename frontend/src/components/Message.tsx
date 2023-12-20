import React from 'react';
import { MessageType } from '../types/types';

export default function Message({message, userId}: {message: MessageType, userId: number}) {

    const bubbleColor = userId === message.userId ? 'bg-blue-500' : 'bg-teal-600';
    const messagePosition = userId === message.userId ? 'justify-end' : 'justify-start';
    const usernameColor = message.userLevel === 0 ? 'text-gray-300' : 'text-amber-600';
    
  return (
    <div className={'flex mr-4 '.concat(messagePosition)}>
        <div className="w-auto text-gray-300 my-2">
        <div className={'rounded-full flex '.concat(messagePosition)}>
            <img src={message.logo} alt="logo" className='h-8 w-8' />
            <p className={'text-center mt-0.5 ml-1 text-lg '.concat(usernameColor)}>{message.username}</p>
        </div>
        <div className='flex items-start'>
            <div className={' rounded-lg p-2 text-left whitespace-normal inline-block max-w-[26rem] break-words '.concat(bubbleColor)}>
            {message.message}
            </div>
        </div>
        <div className={'text-xs text-gray-400 flex '.concat(messagePosition)}>
            {message.sentTime.getHours()}:{message.sentTime.getMinutes()}
        </div>
        </div>
    </div>
  )
}
