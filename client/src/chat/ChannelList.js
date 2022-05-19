import React from "react";
import { Channel } from "./Channel";
// export class ChannelList extends React.Component {
//     render() {

//         let list = `There is no channels to show`;
//         if (this.props.channels) {
//             list = this.props.channels.map(c => <channel key="{c.id}" id="{c.id}" name="{c.name}" participants="{c.participants}">);</channel>
//         }
//         return (
//             <div classname="channel-list"></div>
// ‍
//                 {list}
// ‍
//             );
//         }
// ‍}

export default function ChannelList({ channels, currentUser }) {
  //   const [user, setUser] = useState(null);
  return (
    <div>
      <h1>ChannelList</h1>
      <Channel />;
    </div>
  );
}
