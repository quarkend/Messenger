import React from "react";
import { ChannelList } from "./ChannelList";
import "./chat.css";
import { useState } from "react";

//                 <div classname="chat-app"></div>
// ‍
//                     <channellist channels="{this.state.channels}"></channellist>

export default function Chat() {
  const [channels, setChannels] = useState([
    { id: 1, name: "first", participants: 10 },
  ]);

  return (
    <>
      <div>Chat</div>
      <ChannelList onClick={() => setChannels(channels)} />
      {channels}
    </>
  );
}
