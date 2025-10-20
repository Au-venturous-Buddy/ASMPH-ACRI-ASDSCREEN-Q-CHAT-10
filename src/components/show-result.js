import React from "react"
import showResultsFields from "../assets/FIELDS/show-results-fields.json";
import questionFields from "../assets/FIELDS/question-fields.json";
import ShowResultMain from "./show-result-main";
import patientInfoFields from "../assets/FIELDS/patient-info-fields.json";

export default function ShowResult(props) {
  return(
    <ShowResultMain partID="0" patientInfoFields={patientInfoFields} patientInfo={props.patientInfo} questionFields={questionFields} showResultsFields={showResultsFields} currentLanguage={props.currentLanguage} scores={props.scoreMatrix} selectedItems={props.selectedItems} restartTestMain={props.restartTestMain} risk={props.risk} overallScore={props.overallScore} data={props.data} />
  )
}