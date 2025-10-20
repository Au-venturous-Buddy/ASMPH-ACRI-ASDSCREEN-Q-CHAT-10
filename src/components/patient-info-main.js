import React from "react"
import Layout from "./layout"
import SEO from "./seo"
import { Form, Button } from "react-bootstrap";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import DatePicker from "react-datepicker";
import { BsCaretRightFill, BsCaretLeftFill, BsCircle, BsCircleFill } from "react-icons/bs";
import SettingsWindow from "./settings-window";
import { v4 as uuidv4 } from 'uuid';

// Source:
// https://stackoverflow.com/questions/12251325/javascript-date-to-calculate-age-work-by-the-day-months-years
// https://www.codegrepper.com/code-examples/javascript/javascript+get+age+by+birth+date
function getAgeWithMonths(dob) {
  var now = new Date();

  var yearNow = now.getYear();
  var monthNow = now.getMonth();
  var dateNow = now.getDate();

  var yearDob = dob.getYear();
  var monthDob = dob.getMonth();
  var dateDob = dob.getDate();
  var age = {};

  var yearAge = yearNow - yearDob;
  var monthAge = 0;
  
  if (monthNow >= monthDob)
    monthAge = monthNow - monthDob;
  else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  if(dateNow < dateDob) {
    monthAge--;

    if(monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  age = {
    years: yearAge,
    months: monthAge
  };

  return JSON.stringify(age);
}

function SelectSexButton({sexType, text, changeSex, currentSex, disabled}) {
  const changeSexMain = () => {
    changeSex(sexType)
  }

  return(
    (sexType === currentSex) ?
    (<li style={{display: "inline"}}>
      <Button disabled={disabled} className="radio-button me-2" style={{textAlign: "left"}} ariaLabel={"(Selected) " + (text.replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " "))} onClick={changeSexMain}>
        <span aria-hidden><BsCircleFill /> <span className="radio-button-text" dangerouslySetInnerHTML={{__html: text}}></span></span>
      </Button>
    </li>) :
    (<li style={{display: "inline"}}>
      <Button disabled={disabled} className="radio-button me-2" style={{textAlign: "left"}} ariaLabel={"(Not Selected) " + (text.replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " "))} onClick={changeSexMain}>
        <span aria-hidden><BsCircle /> <span className="radio-button-text" dangerouslySetInnerHTML={{__html: text}}></span></span>
      </Button>
    </li>)
  )
}

function saveNewChild(state, submitPatientInfoMain) {
  var childInfo = {child_name: state.childName, child_birthdate: state.birthDate, child_sex: state.childSex, child_age: state.childAge}
  
  var newChildId = uuidv4()
  childInfo['child_id'] = newChildId
  
  submitPatientInfoMain(childInfo)
}

function SubmitButton(props) {
  return(
    <Button disabled={props.disabled} style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} onClick={props.onClick}>Submit</Button>
  )
}

export default class PatientInfoMain extends React.Component {
    state = {
      birthDate: new Date(),
      childId: "",
      childName: "",
      childAge: null,
      childSex: null,
      disableFields: false,
      currentLanguage: this.props.currentLanguage
    }

    submitPatientInfoMain = (childInfo) => {
      this.props.submitPatientInfo(childInfo, this.state.currentLanguage)
    }

    changePatientSex = (sexType) => {
      this.setState({childSex: sexType});
    }

    changeBirthDate = (date) => {
      this.setState({birthDate: date})
      this.setState({childAge: getAgeWithMonths(date)})
    }

    changeLanguage = (partID) => {
      var language = document.getElementById(`language-selector-${partID}`).value;
      this.props.stateMain.changeLanguageHistory.push(language)
      this.setState({currentLanguage: language});
    }

    setPatientNameMain = () => {
      this.setState({childName: document.getElementById("patient-name").value});
    }

    clearAllFields = () => {
      this.setState({birthDate: new Date()});
      this.setState({childId: ""});
      this.setState({childName: ""});
      this.setState({childAge: null});
      this.setState({childSex: null});

      document.getElementById("patient-name").value = "";
    }

    render() {
    var years = [];
    for(var year = (new Date()).getFullYear() - 4; year < (new Date()).getFullYear() + 1; year++) {
      years.push(year);
    }
    const months = this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["months"];

    var metadataItems = null;
    for(var i = 0; i < this.props.data.allFile.edges.length; i++) {
      var nodeItem = this.props.data.allFile.edges[i].node

      if(nodeItem.ext === ".md" && nodeItem.name === "index") {
        metadataItems = nodeItem;
        break;
      }
    }

    return(
        <Layout>
        <SEO title={metadataItems.childMarkdownRemark.frontmatter.title} />
        <section className="pt-3 mt-3 mb-5 main-background" style={{paddingBottom: "1in"}}>
          <section lang={this.props.patientInfoFields[this.state.currentLanguage]["language_code"]} className="questionnaire-main m-3">
            <section className="questionnaire-contents">
              <SettingsWindow partID="patient-info" restartTest={this.clearAllFields} clearSelectedItems={this.clearAllFields} currentLanguage={this.state.currentLanguage} languageOptions={metadataItems.childMarkdownRemark.frontmatter.languages} changeLanguage={this.changeLanguage} />
              <section style={{textAlign: "center"}} className="mb-3">
                <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
                  {metadataItems.childMarkdownRemark.frontmatter.title}
                </ResponsiveHeader>
              </section>
              <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="patient-name" aria-label={this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["name"].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span aria-hidden dangerouslySetInnerHTML={{__html: this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["name"] + ":"}}></span>
                </Form.Label>
                <Form.Control disabled={this.state.disableFields} onChange={this.setPatientNameMain} className="text-input" id="patient-name" type="text" placeholder="ex. Juan dela Cruz" value={this.state.childName} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label aria-label={this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["birthdate"].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span aria-hidden dangerouslySetInnerHTML={{__html: this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["birthdate"] + ":"}}></span>
                </Form.Label>
                <DatePicker 
                  disabled={this.state.disableFields}
                  selected={this.state.birthDate} 
                  withPortal 
                  onChange={(date) => this.changeBirthDate(date)} 
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button className="m-1" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        <BsCaretLeftFill />
                      </Button>
          
                      <Form.Select 
                        className="m-1"
                        value={months[date.getMonth()]}
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Select 
                        className="m-1" 
                        value={date.getFullYear()}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
          
                      <Button className="m-1" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        <BsCaretRightFill />
                      </Button>
                    </div>
                  )}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label aria-label={this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["sex"].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span aria-hidden dangerouslySetInnerHTML={{__html: this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["sex"] + ":"}}></span>
                </Form.Label>
                <ul>
                  {Object.keys(this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["sex_options"]).map((item) => (
                    <SelectSexButton sexType={item} text={this.props.patientInfoFields[this.state.currentLanguage]["field_names"]["sex_options"][item]} changeSex={this.changePatientSex} currentSex={this.state.childSex} disabled={this.state.disableFields} />
                  ))}
                </ul>
              </Form.Group>
              <Form.Group style={{textAlign: "center"}}>
                <SubmitButton disabled={!(((this.state.childName) && (this.state.childName.trim().length > 0)) && ((this.state.childAge) && (JSON.parse(this.state.childAge).years > -1)) && this.state.childSex)} onClick={() => (saveNewChild(this.state, this.submitPatientInfoMain))} />
              </Form.Group>
            </Form>
          </section>
        </section>
      </section>
    </Layout>
  )
  }
}