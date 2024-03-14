"use client"

import React, { useEffect, useState } from 'react';
import '@livekit/components-styles';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function RoomPage() {
  const [token, setToken] = useState("");
  const [room , setRoom] = useState('');
  const [name , setName] = useState('');

  const fetchData = async () => {
    try {
      const resp = await fetch(
        `/api/get-participant-token?room=${room}&username=${name}`
      );
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    }
  };

//   useEffect(() => {
//     if (room !== "" && name !== "") {
//       fetchData();
//     }
//   }, [room, name]);

  const handleSelectRoom = () => {
    if (room !== "" && name !== "") {
      fetchData();
    }
  };

  return (
    <div>
      {token === "" ? (
        <div className="w-full gap-4 h-screen flex flex-col items-center justify-center">
          <input className='py-2 px-5 rounded-2xl text-black font-semibold' type="text" placeholder='name' onChange={(e) => setName(e.target.value)} />
          <input className="py-2 px-5 rounded-2xl text-black font-semibold" type="text" placeholder="rooms" onChange={(e) => setRoom(e.target.value)} />
          <button className="px-14 py-2 bg-sky-500 rounded-2xl" onClick={handleSelectRoom}>select</button>
        </div>
      ) : (
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: '100dvh' }}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar/>
        </LiveKitRoom>
      )}
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
