import React from "react"
import { Button } from "react-bootstrap"
import ResponsiveHeader from "./responsive-header";
import {BsPlayCircle} from "react-icons/bs";

export default function QuestionnaireCover({title, slug}) {
  return(
    <Button className="my-3" href={slug}>
      <div className="questionnaire-preview">
        <div className="questionnaire-preview-title">
          <ResponsiveHeader level={2} maxSize={2} minScreenSize={460}>
            {title} <br />
            <BsPlayCircle aria-hidden />
          </ResponsiveHeader>
        </div>
      </div>
    </Button>
  )
}