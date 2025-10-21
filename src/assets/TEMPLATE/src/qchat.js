import React from "react"
import Questionnaire from "../../../components/questionnaire";
import ShowResult from "./show-result";
import questionFields from "../../FIELDS/question-fields.json";

export default function QCHATTest(props) {
  const getResult = (scores, state, items) => {
    var overallScore = 0;
    Object.keys(scores).forEach((key) => {
      overallScore = overallScore + scores[key]
    })
  
    var risk = "Low";
    if(overallScore >= 3) {
      risk = "High";
    }
  
    Object.keys(items).forEach((questionID) => {
    props.updateMainTestAnswerSummary({
      item_answer: items[questionID]['choicesID'][state.selectedItems[questionID]].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " "),
      item_point: scores[questionID]
    }, questionID)})
        
    props.changePart(<ShowResult patientInfo={props.patientInfo} currentLanguage={state.currentLanguage} scoreMatrix={props.stateMain.mainTestScoreMatrix} selectedItems={state.selectedItems} restartTestMain={props.restartTestMain} risk={risk} overallScore={overallScore} data={props.data} />)
  }

  return(
    <Questionnaire partID="0" questionFields={questionFields} getResult={getResult} currentLanguage={props.currentLanguage} data={props.data} stateMain={props.stateMain} restartTestMain={props.restartTestMain} updateCurrentScoreMatrix={props.updateMainTestScoreMatrix} scores={props.stateMain.mainTestScoreMatrix} />
  )
}