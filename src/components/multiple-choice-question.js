import React from "react"
import { Button } from "react-bootstrap";
import ResponsiveHeader from "./responsive-header";
import {BsCircle, BsCircleFill} from "react-icons/bs";
import ShowAudio from "./show-audio";

function MultipleChoiceItem(props) {
    const updateScores = () => {
      props.updateCurrentScoreMatrix(props.score, props.questionID)
      props.updateSelectedItems(props.questionID, props.index)
    }

    return(
      <span className="me-4" hidden={props.hidden}>
        <Button aria-label={props.ariaLabel} className="radio-button me-2" style={{textAlign: "left"}} onClick={updateScores}>
          <span aria-hidden>
            {props.children}
          </span>
        </Button>
        <ShowAudio audioLink={props.audio} />
      </span>
    )
}

export default function MultipleChoiceQuestion(props) {
    return(
      <section>
        <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
          <span aria-label={(props.questionField['question'] + `&nbsp;${props.questionName}`).replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ")}>
            <span aria-hidden dangerouslySetInnerHTML={{__html: props.questionField['question'] + `&nbsp;${props.questionName}`}}></span>
          </span>
        </ResponsiveHeader>
        <section className="mb-2" aria-label={props.question.html.replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "").replace(/<br(.*?)>/gm, " ")} style={{textAlign: "left"}}>
          <article aria-hidden dangerouslySetInnerHTML={{ __html: props.question.html }}></article>
          <ShowAudio audioLink={props.question.frontmatter.audio} />
        </section>
        <section>
        <div dangerouslySetInnerHTML={{__html: props.questionField['choices_intro'] + ":"}}></div>
        <ul className="pl-0" style={{textAlign: "left"}}>
          {props.choices.map((value, index) => (
            (index === props.currentItem) ?
            (<li className="mt-2" style={{display: (props.choices.length > 2 ? "" : "inline")}}>
              <MultipleChoiceItem audio={value.audio} ariaLabel={"(Selected) " + (value.text.replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " "))} overallState={props.overallState} score={props.scores[index]} questionID={props.questionID} index={index} updateCurrentScoreMatrix={props.updateCurrentScoreMatrix} updateSelectedItems={props.updateSelectedItems}>
                <BsCircleFill /> <span className="radio-button-text" dangerouslySetInnerHTML={{__html: value.text}}></span>
              </MultipleChoiceItem>
            </li>) :
            (<li className="mt-2" style={{display: (props.choices.length > 2 ? "" : "inline")}}>
              <MultipleChoiceItem audio={value.audio} ariaLabel={"(Not Selected) " + (value.text.replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " "))} hidden={(props.disableChoices) && (props.disableChoices.includes(index.toString()))} overallState={props.overallState} score={props.scores[index]} questionID={props.questionID} index={index} updateCurrentScoreMatrix={props.updateCurrentScoreMatrix} updateSelectedItems={props.updateSelectedItems}>
                <BsCircle /> <span className="radio-button-text" dangerouslySetInnerHTML={{__html: value.text}}></span>
              </MultipleChoiceItem>
            </li>)
          ))}
        </ul>
        </section>
      </section>
    )
}