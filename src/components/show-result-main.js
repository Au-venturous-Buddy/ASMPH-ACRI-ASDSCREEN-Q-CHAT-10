import React, {useState} from "react"
import Layout from "./layout"
import SEO from "./seo"
import { Button } from "react-bootstrap";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import SettingsWindow from "./settings-window";
import ShowAudio from "./show-audio";

export default function ShowResultMain(props) {
    const [currentLanguage, setCurrentLanguage] = useState(props.currentLanguage)
    
    const changeLanguage = (partID) => {
      var language = document.getElementById(`language-selector-${partID}`).value;
      setCurrentLanguage(language);
    }

    var questions = [];
    var choices = [];
    var currentLanguageCode = `en`;
    var questionArrangement = [];
    var metadataItems = null;
    for(var i = 0; i < props.data.allFile.edges.length; i++) {
      var nodeItem = props.data.allFile.edges[i].node

      if(nodeItem.relativeDirectory.includes(`PARTS/${props.partID}/ITEMS`) && nodeItem.ext === ".md") {
        if(nodeItem.relativeDirectory.includes(`PARTS/${props.partID}/ITEMS/${currentLanguage}`)) {
          if(nodeItem.name === "lang-info") {
            currentLanguageCode = nodeItem.childMarkdownRemark.frontmatter.language_code
          }
          else if(nodeItem.relativeDirectory.includes("/QUESTIONS")) {
            questions.push(nodeItem);
          }
          else if(nodeItem.relativeDirectory.includes("/CHOICES")) {
            choices.push(nodeItem);
          }
        }
      }
      else if(nodeItem.relativeDirectory.includes(`PARTS/${props.partID}`) && nodeItem.ext === ".md" && nodeItem.name === "part-info") {
        questionArrangement = nodeItem.childMarkdownRemark.frontmatter.arrangement;
      }
      else if(nodeItem.ext === ".md" && nodeItem.name === "index") {
        metadataItems = nodeItem;
      }
    }

    var sectionNum = 0;
    var maxSectionNum = parseInt(questions[questions.length - 1].name);
    var currentQuestion = null;
    var currentChoices = [];
    var nextQuestionID = 0;
    var nextChoiceID = 0;
    var allQuestions = {};
    while(sectionNum <= maxSectionNum) {
      if(nextQuestionID < questions.length && parseInt(questions[nextQuestionID].name) === sectionNum) {
        currentQuestion = questions[nextQuestionID].childMarkdownRemark;
        nextQuestionID++;
      }

      if(nextChoiceID < choices.length && parseInt(choices[nextChoiceID].name) === sectionNum) {
        currentChoices = choices[nextChoiceID].childMarkdownRemark.frontmatter.choices;
        nextChoiceID++;
      }

      var questionNum = questionArrangement[sectionNum].position
      allQuestions[questionNum] = {"name": questionArrangement[sectionNum].name, "question": currentQuestion, "choices": currentChoices}

      sectionNum++;
    }

    var answerSummarySection = [];
    if(props.followUpAnswerSummary) {
      Object.keys(props.followUpAnswerSummary).forEach((questionID) => {
        answerSummarySection.push(
        <li>
          <section className="px-0">
            <span className="m-3"><ResponsiveHeader level={3} maxSize={1.5} minScreenSize={500}><span dangerouslySetInnerHTML={{__html: props.questionFields[currentLanguage]['question'] + `&nbsp;${allQuestions[questionID]['name']}`}}></span></ResponsiveHeader></span>
            <section aria-label={allQuestions[questionID]['question'].html.replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "")}>
              <section>
                <article aria-hidden dangerouslySetInnerHTML={{ __html: allQuestions[questionID]['question'].html }}></article>
                <ShowAudio audioLink={allQuestions[questionID]['question'].frontmatter.audio} />
              </section>
            </section>
            <section aria-label={((props.scores[questionID] === 1) ? (props.showResultsFields[currentLanguage]['field_names']['item_score']['fail'].text) : (props.showResultsFields[currentLanguage]['field_names']['item_score']['pass'].text)).replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + " (Score: " + props.scores[questionID] + ")"}>
              <section>
                <p aria-hidden className="my-3 text-input" style={{color: ((props.scores[questionID] === 1) ? "red" : "#006400")}} dangerouslySetInnerHTML={{__html: ((props.scores[questionID] === 1) ? props.showResultsFields[currentLanguage]['field_names']['item_score']['fail'].text + " (Score: " + props.scores[questionID] + ")" : props.showResultsFields[currentLanguage]['field_names']['item_score']['pass'].text + " (Score: " + props.scores[questionID] + ")")}}></p>
                <ShowAudio audioLink={((props.scores[questionID] === 1) ? props.showResultsFields[currentLanguage]['field_names']['item_score']['fail'].audio : props.showResultsFields[currentLanguage]['field_names']['item_score']['pass'].audio)} />
              </section>
            </section>
          </section>
        </li>
        )
      })
    }
    else {
      Object.keys(allQuestions).forEach((questionID) => answerSummarySection.push(
        <li>
          <section className="px-0">
            <span className="m-3"><ResponsiveHeader level={3} maxSize={1.5} minScreenSize={500}><span dangerouslySetInnerHTML={{__html: props.questionFields[currentLanguage]['question'] + `&nbsp;${allQuestions[questionID]['name']}`}}></span></ResponsiveHeader></span>
            <section aria-label={allQuestions[questionID]['question'].html.replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "")}>
              <section>
                <article aria-hidden dangerouslySetInnerHTML={{ __html: allQuestions[questionID]['question'].html }}></article>
                <ShowAudio audioLink={allQuestions[questionID]['question'].frontmatter.audio} />
              </section>
            </section>
            <section aria-label={(allQuestions[questionID]['choices'][props.selectedItems[questionID]].text).replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + " (Score: " + props.scores[questionID] + ")"}>
              <section>
                <p aria-hidden className="my-3 text-input" style={{color: ((props.scores[questionID] === 1) ? "red" : "#006400")}} dangerouslySetInnerHTML={{__html: (allQuestions[questionID]['choices'][props.selectedItems[questionID]].text + " (Score: " + props.scores[questionID] + ")")}}></p>
                <ShowAudio audioLink={(allQuestions[questionID]['choices'][props.selectedItems[questionID]].audio)} />
              </section>
            </section>
          </section>
        </li>
      ))
    }

    return(
        <Layout>
        <SEO title={metadataItems.childMarkdownRemark.frontmatter.title} />
        <section className="pt-3 mt-3 mb-5 main-background" style={{paddingBottom: "1in"}}>
          <section className="questionnaire-main m-3">
            <section className="questionnaire-contents">
            <SettingsWindow hideClearAnswersButton partID="show-result" restartTest={props.restartTestMain} clearSelectedItems={props.restartTestMain} currentLanguage={currentLanguage} stateMain={props.stateMain} languageOptions={metadataItems.childMarkdownRemark.frontmatter.languages} changeLanguage={changeLanguage} />
            <section style={{textAlign: "center"}} className="justify-content-center mx-3 mb-2">
              <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
                {metadataItems.childMarkdownRemark.frontmatter.title}
              </ResponsiveHeader>
            </section>
            <section className="justify-content-center">
            <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
              Patient Info:
            </ResponsiveHeader>
            <section className="justify-content-center mx-0 mb-2">
              <ResponsiveHeader level={3} maxSize={1.5} minScreenSize={500}>
                <span aria-label={props.patientInfoFields[currentLanguage]["field_names"]["name"].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span aria-hidden dangerouslySetInnerHTML={{__html: props.patientInfoFields[currentLanguage]["field_names"]["name"] + ":"}}></span>
                </span>
              </ResponsiveHeader>
              <p className="my-2 p-2 text-input">{props.patientInfo.child_name}</p>
            </section>
            <section className="justify-content-center mx-0 mb-2">
              <ResponsiveHeader level={3} maxSize={1.5} minScreenSize={500}>
              <span aria-label={props.patientInfoFields[currentLanguage]["field_names"]["age"].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                <span aria-hidden dangerouslySetInnerHTML={{__html: props.patientInfoFields[currentLanguage]["field_names"]["age"] + ":"}}></span>
              </span>
              </ResponsiveHeader>
              <p className="my-2 p-2 text-input">{JSON.parse(props.patientInfo.child_age).years + " years and " + JSON.parse(props.patientInfo.child_age).months + " months old"}</p>
            </section>
            <section className="justify-content-center mx-0 mb-2">
              <ResponsiveHeader level={3} maxSize={1.5} minScreenSize={500}>
              <span aria-label={props.patientInfoFields[currentLanguage]["field_names"]["sex"].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                <span aria-hidden dangerouslySetInnerHTML={{__html: props.patientInfoFields[currentLanguage]["field_names"]["sex"] + ":"}}></span>
              </span>
              </ResponsiveHeader>
              <p className="my-2 p-2 text-input">{props.patientInfoFields[currentLanguage]["field_names"]["sex_options"][props.patientInfo.child_sex]}</p>
            </section>
            </section>
            <section className="justify-content-center">
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                <span aria-label={props.showResultsFields[currentLanguage]['field_names']['results_summary'].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span dangerouslySetInnerHTML={{__html: props.showResultsFields[currentLanguage]['field_names']['results_summary'] + ":"}}></span>
                </span>
              </ResponsiveHeader>
              <ol lang={currentLanguageCode}>
                {answerSummarySection}
              </ol>
            </section>
            <section className="justify-content-center mx-0 mb-2">
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                <span aria-label={props.showResultsFields[currentLanguage]['field_names']['number_of_failed_items'].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span aria-hidden dangerouslySetInnerHTML={{__html: props.showResultsFields[currentLanguage]['field_names']['number_of_failed_items'] + ":" }}></span>
                </span>
              </ResponsiveHeader>
              <p className="my-2 p-2 text-input" style={{textAlign: "center", color: ((props.risk === "High") ? "red" : ((props.risk === "Low") ? "#006400" : "#FFA500"))}}>{props.overallScore}</p>
            </section>
            <section className="justify-content-center mx-0 mb-2" style={{textAlign: "left"}}>
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                <span aria-label={props.showResultsFields[currentLanguage]['field_names']['what_it_means'].replace(/<[\/]?span(.*?)>/g, "").replace(/&nbsp;/g, " ") + ":"}>
                  <span dangerouslySetInnerHTML={{__html: props.showResultsFields[currentLanguage]['field_names']['what_it_means'] + ":"}}></span>
                </span>
              </ResponsiveHeader>
              {(props.risk === "Low") ?
              (
                <section aria-label={props.showResultsFields[currentLanguage]['field_names']['comment']['low_risk']['text'].replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "")}>
                  <section>
                    <article aria-hidden className="p-3 my-2 result-comment" dangerouslySetInnerHTML={{__html: props.showResultsFields[currentLanguage]['field_names']['comment']['low_risk']['text']}}></article>
                    <ShowAudio audioLink={props.showResultsFields[currentLanguage]['field_names']['comment']['low_risk']['audio']} />
                  </section>
                </section>
              ) : (
              (props.risk === "High") ?
              (
                <section aria-label={props.showResultsFields[currentLanguage]['field_names']['comment']['high_risk']['text'].replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "")}>
                  <section>
                    <article aria-hidden className="p-3 my-2 result-comment" dangerouslySetInnerHTML={{__html: props.showResultsFields[currentLanguage]['field_names']['comment']['high_risk']['text']}}></article>
                    <ShowAudio audioLink={props.showResultsFields[currentLanguage]['field_names']['comment']['high_risk']['audio']} />
                  </section>
                </section>
              ) :
              (
                <section aria-label={props.showResultsFields[currentLanguage]['field_names']['comment']['medium_risk']['text'].replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "")}>
                  <section>
                    <article aria-hidden className="p-3 my-2 result-comment" dangerouslySetInnerHTML={{__html: props.showResultsFields[currentLanguage]['field_names']['comment']['medium_risk']['text']}}></article>
                  </section>
                </section>
              )
              )}
            </section>
            <section style={{textAlign: "center"}}>
              {
                (props.risk === "Low" || props.risk === "High") ?
                (
                  <>
                    <Button style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} onClick={props.restartTestMain}>Restart Test</Button>
                    <Button className="secondary-color ms-2" style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} href="https://au-venturous-buddy.github.io/au-venturous-buddy-website/asdscreen/">Home Page</Button>
                  </>
                ) :
                (
                  <>
                    {props.followUpIntroButton}
                  </>
                )
              }
            </section>
          </section>
        </section>
      </section>
    </Layout>
  )
}
