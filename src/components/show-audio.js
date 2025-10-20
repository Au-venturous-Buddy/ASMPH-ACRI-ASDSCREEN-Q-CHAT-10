import React, {useState} from "react";
import {OverlayTrigger, Popover, Button} from 'react-bootstrap';
import {AiOutlineSound, AiFillSound} from 'react-icons/ai';

export default function ShowAudio({audioLink}) {
  const [showAudioActive, setShowAudioActive] = useState(false);

  const activateAudio = () => {
    setShowAudioActive(!showAudioActive);
  }

  const popover = (
    <Popover className="audio-player">
      <Popover.Body>
        <iframe allow="autoplay" className="m-3" src={audioLink}></iframe>
      </Popover.Body>
    </Popover>
  );

  return(
    <OverlayTrigger trigger="click" placement="bottom-start" overlay={popover}>
      <Button className="show-audio-button" style={showAudioActive ? {background: "rgb(44, 56, 140)", color: "white"} : {background: "white", color: "rgb(44, 56, 140)"}} onClick={activateAudio}>
        {
          (showAudioActive) ?
          (<AiFillSound />) :
          (<AiOutlineSound />)
        }
      </Button>
    </OverlayTrigger>
  )
}