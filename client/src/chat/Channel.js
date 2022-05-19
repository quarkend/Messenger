import React from "react";

export default function Channel({ name, participants }) {
  return (
    <div classname="channel-item">
      ‍<span>{participants.name}</span>
    </div>
  );
}
