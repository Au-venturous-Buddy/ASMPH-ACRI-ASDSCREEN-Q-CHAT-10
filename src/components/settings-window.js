import React, {useState} from "react"
import { OverlayTrigger, Popover, Form, Button } from "react-bootstrap";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import {FaUndoAlt} from "react-icons/fa";
import {ImExit} from "react-icons/im";
import {BsEraserFill} from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";

export default function SettingsWindow(props) {
    const [showSettings, setShowSettings] = useState(false);

    const activateSettings = () => {
      setShowSettings(!showSettings);
    }

    const changeLanguageProper = () => {
      props.changeLanguage(props.partID)
    }

    const popover = (
      <Popover className="mb-3 p-3 settings-section">
        <Popover.Header style={{border: "none", background: "rgba(0, 0, 0, 0)"}}>
          <ResponsiveHeader level={1} maxSize={2} minScreenSize={500}>Settings</ResponsiveHeader>
        </Popover.Header>
        <Popover.Body>
          <section className="mb-3 justify-content-center">
            <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
              Language
            </ResponsiveHeader>
            <section className="my-3">
              <Form.Select className="mb-2 language-selector-base" id={`language-selector-${props.partID}`} onChange={changeLanguageProper} value={props.currentLanguage}>
                {props.languageOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Form.Select>
            </section>
          </section>
          <section className="mt-3 mb-5 justify-content-center">
            <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
              Other Settings
            </ResponsiveHeader>
            <section className="d-grid gap-2">
              <Button className="settings-section-button" hidden={props.hideClearAnswersButton} onClick={props.clearSelectedItems}><BsEraserFill aria-hidden /> Clear Answers</Button>
              <Button className="settings-section-button" onClick={props.restartTest}><FaUndoAlt aria-hidden /> Restart Test</Button>
              <Button className="settings-section-button" href="https://au-venturous-buddy.github.io/au-venturous-buddy-website/asdscreen/"><ImExit aria-hidden /> Quit Test</Button>
            </section>
          </section>
        </Popover.Body>
      </Popover>
    );

    return(
      <section style={{textAlign: "right"}} className="mb-3">
        <OverlayTrigger trigger="click" placement="bottom-end" overlay={popover}>
          <Button className="settings-section-button" style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500), background: (showSettings ? "rgb(44, 56, 140)" : "white"), color: (showSettings ? "white" : "rgb(44, 56, 140)")}} onClick={activateSettings}>
            <AiFillSetting aria-hidden /> Settings
          </Button>
        </OverlayTrigger>
      </section>
    )
}
