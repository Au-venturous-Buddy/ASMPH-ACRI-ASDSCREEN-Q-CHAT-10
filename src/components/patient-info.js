import React from "react"
import QCHATTest from "./qchat";
import patientInfoFields from "../assets/FIELDS/patient-info-fields.json";
import PatientInfoMain from "./patient-info-main"

export default function PatientInfo(props) {
  const submitPatientInfo = (patientInfo, currentLanguage) => {
    props.changePart((<QCHATTest currentLanguage={currentLanguage} patientInfo={patientInfo} data={props.data} stateMain={props.stateMain} changePart={props.changePart} restartTestMain={props.restartTestMain} updateMainTestScoreMatrix={props.updateMainTestScoreMatrix} updateMainTestAnswerSummary={props.updateMainTestAnswerSummary} />))
  }

  return(
    <PatientInfoMain currentLanguage={props.currentLanguage} data={props.data} stateMain={props.stateMain} restartTestMain={props.restartTestMain} submitPatientInfo={submitPatientInfo} patientInfoFields={patientInfoFields} />
  )
}