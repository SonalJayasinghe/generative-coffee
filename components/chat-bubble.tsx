import React from "react";

interface Props {
  message: string;
  sender: string;
}

const ChatBubble = ({ message, sender }: Props) => {
  const bgColor = sender === "user" ? "bg-green-900 text-end text-white" : "bg-gray-100";
  return (
    <>
      <div className=" flex">
        <div className={`relative p-3 m-2 rounded-xl text-sm ${bgColor}`}>
          <p>{message}</p>
        </div>
      </div>
    </>
  );
};

export default ChatBubble;