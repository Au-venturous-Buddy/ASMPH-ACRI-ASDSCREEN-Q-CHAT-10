import React from "react"
import PatientInfo from "./patient-info";
import patientInfoFields from "../assets/FIELDS/patient-info-fields.json";
import SetLanguageAudioMain from "./set-language-audio-main"

export default function SetLanguageAudio(props) {
    const startTest = (currentLanguage) => {
      props.changePart((<PatientInfo currentLanguage={currentLanguage} data={props.data} stateMain={props.stateMain} changePart={props.changePart} restartTestMain={props.restartTestMain} updateMainTestScoreMatrix={props.updateMainTestScoreMatrix} updateMainTestAnswerSummary={props.updateMainTestAnswerSummary} />))
    }
  
    return(
      <SetLanguageAudioMain data={props.data} stateMain={props.stateMain} restartTestMain={props.restartTestMain} startTest={startTest} patientInfoFields={patientInfoFields} />
    )
}