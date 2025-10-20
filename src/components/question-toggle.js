import React, {useState} from "react"
import { Modal, Button } from "react-bootstrap";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import {BsCircle, BsCircleFill, BsCaretLeftFill, BsCaretRightFill, BsPlayCircle} from "react-icons/bs";

function PreviousButton({goToQuestion, questionIndex, numQuestions}) {
  const previousSlide = () => {
    goToQuestion(questionIndex, (questionIndex > 0) ? (questionIndex - 1) : (numQuestions - 1));
  }
  
  return(
    <Button
      onClick={previousSlide}
      aria-label="Previous"
      style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}}
      hidden={questionIndex === 0}
      className="secondary-color"
    >
      <span aria-hidden={true}><BsCaretLeftFill /> Previous</span>
    </Button>
  )
}

function NextButton({goToQuestion, questionIndex, numQuestions}) {
  const nextSlide = () => {
    goToQuestion(questionIndex, (questionIndex + 1) % numQuestions);
  }
  
  return(
    <Button
      onClick={nextSlide}
      aria-label="Next"
      style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}}
      hidden={questionIndex === (numQuestions - 1)}
      className={(questionIndex === (numQuestions - 1)) ? "" : "ms-2 secondary-color"}
    >
      <span aria-hidden={true}>Next <BsCaretRightFill /></span>
    </Button>
  )
}

function QuestionThumbnail({questionField, questionName, question, choices, answer, questionIndex, index, goToQuestion, closeFunction, disableChoices}) {
    const changeQuestion = () => {
      goToQuestion(questionIndex, parseInt(index))
      closeFunction()
    }
  
    return(
      <Button className="question-item-thumbnail" aria-label={`Question ${questionName}: ${question.internal.content.replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "")} ${(answer > -1) ? ("Selected Item: " + (choices[answer].text.replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " "))) : "No Items Selected"}`} onClick={changeQuestion}>
        <div aria-hidden>
          <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
            <span style={(questionIndex === parseInt(index)) ? {background: "rgba(255, 255, 0, 0.5)", borderLeft: "5px solid #CDCD00", borderRight: "5px solid #CDCD00"} : {background: "rgba(0, 0, 0, 0)", borderLeft: "5px solid rgba(0, 0, 0, 0)", borderRight: "5px solid rgba(0, 0, 0, 0)"}}>
              <span dangerouslySetInnerHTML={{__html: questionField + `&nbsp;${questionName}`}}></span> <BsPlayCircle />
            </span>
          </ResponsiveHeader>
          <article className="m-3" style={{textAlign: "left"}} dangerouslySetInnerHTML={{ __html: question.html.replace(/<[\/]?iframe(.*?)>/gm, "") }}></article>
          <ul className="m-3 pl-0" style={{textAlign: "left"}}>
            {choices.map((value, index) => (
              (index === answer) ?
              (<li className="my-2" style={{textAlign: "left"}}><BsCircleFill /> <span dangerouslySetInnerHTML={{__html: value.text}}></span></li>) :
              (<li className="my-2" style={{textAlign: "left"}} hidden={(disableChoices.length > 0) && (disableChoices.includes(index.toString()))}><BsCircle /> <span dangerouslySetInnerHTML={{__html: value.text}}></span></li>)
            ))}
          </ul>
        </div>
      </Button>
    )
}

function GetResult(props) { 
  const goToNextPart = () => {
    props.getResult(props.scores, props.state, props.items)
  }

  return (
    <Button onClick={goToNextPart} aria-label="Submit" style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}}>
      Submit
    </Button>
  );
}

export default function QuestionToggle(props) { 
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <section style={{textAlign: "center"}} aria-label="Question Navigator">
        <PreviousButton goToQuestion={props.goToQuestion} questionIndex={props.state.currentQuestion} numQuestions={Object.keys(props.allQuestions).length} />
        <NextButton goToQuestion={props.goToQuestion} questionIndex={props.state.currentQuestion} numQuestions={Object.keys(props.allQuestions).length} /> <br hidden={(props.state.currentQuestion === (Object.keys(props.allQuestions).length - 1)) || (props.state.currentQuestion === 0)} />
        <span className={((props.state.currentQuestion === (Object.keys(props.allQuestions).length - 1)) || (props.state.currentQuestion === 0)) ? "ms-2" : "mt-2"} style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} hidden={props.disableReviewAnswersButton}>
          {
            (Object.keys(props.allQuestions).length > 1) ?
            (
              <Button style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} onClick={handleShow}>
                Review Answers
              </Button>
            ) :
            (
              <GetResult items={props.allQuestions} state={props.state} scores={props.scores} getResult={props.getResult} />
            )
          }
        </span>
      </section>
      <Modal fullscreen show={show} onHide={handleClose} scrollable>
      <Modal.Header className="justify-content-center">
        <Modal.Title>
          <ResponsiveHeader level={1} maxSize={2} minScreenSize={500}>Answer Summary</ResponsiveHeader>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <section className="pt-3 mt-3 mb-5 main-background" style={{textAlign: "center", paddingBottom: "1in"}}>
          <section className="questionnaire-main m-2">
            <section className="questionnaire-contents-modal">
              <ol>
                {Object.keys(props.allQuestions).map((questionID, index) => (
                  <li className="my-3" key={index}>
                    <QuestionThumbnail questionField={props.questionField} disableChoices={props.disableChoices} questionName={props.allQuestions[questionID]['name']} question={props.allQuestions[questionID]['question']} choices={props.allQuestions[questionID]['choices']} answer={props.state.selectedItems[questionID]} questionIndex={props.state.currentQuestion} index={questionID} goToQuestion={props.goToQuestion} closeFunction={handleClose} />
                  </li>
                ))}
              </ol>
              <section style={{textAlign: "center"}}>
                <Button className="secondary-color me-2" style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} onClick={handleClose}><BsCaretLeftFill /> Back</Button>
                <GetResult items={props.allQuestions} state={props.state} scores={props.scores} getResult={props.getResult} />
              </section>
            </section>
          </section>
        </section>
      </Modal.Body>
      </Modal>
    </>
  );
}