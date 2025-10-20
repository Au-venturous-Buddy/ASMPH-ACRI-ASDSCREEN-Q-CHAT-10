import React from "react"
import Layout from "./layout"
import SEO from "./seo"
import ResponsiveHeader from "./responsive-header";
import SettingsWindow from "./settings-window";
import MultipleChoiceQuestion from "./multiple-choice-question";
import QuestionToggle from "./question-toggle";
  
export default class Questionnaire extends React.Component {
    state = {
      currentLanguage: this.props.currentLanguage,
      currentQuestion: 0,
      selectedItems: {},
      currentQuestionSelectedItem: -1,
      currentPartScoreMatrix: {}
    }
    
    changeLanguage = (partID) => {
      var language = document.getElementById(`language-selector-${partID}`).value;
      this.props.stateMain.changeLanguageHistory.push(language);
      this.setState({currentLanguage: language});
    }

    goToQuestion = (oldQuestionNum, newQuestionNum) => {
      this.state.selectedItems[oldQuestionNum] = this.state.currentQuestionSelectedItem;
      this.setState({currentQuestion: newQuestionNum});
      this.setState({currentQuestionSelectedItem: this.state.selectedItems[newQuestionNum]})
    }
    
    updateSelectedItems = (questionID, index) => {
      this.state.selectedItems[questionID] = index;
      this.setState({currentQuestionSelectedItem: this.state.selectedItems[questionID]})
    }
    
    clearSelectedItems = () => {
      this.setState({currentQuestionSelectedItem: -1})
      Object.keys(this.state.selectedItems).forEach((key) => {
        this.state.selectedItems[key] = -1
      })
    }
    
    updateCurrentPartScoreMatrix = (score, questionID) => {
      this.state.currentPartScoreMatrix[questionID] = score;
    }
    
    render() {
      var metadataItems = null;
      var questions = [];
      var choices = [];
      var choices_id = [];
      var scores = [];
      var currentLanguageCode = `en`;
      var questionArrangement = [];
      for(var i = 0; i < this.props.data.allFile.edges.length; i++) {
        var nodeItem = this.props.data.allFile.edges[i].node
    
        if(nodeItem.relativeDirectory.includes(`PARTS/${this.props.partID}/SCORES`) && nodeItem.ext === ".md") {
          scores.push(nodeItem);
        }
        else if(nodeItem.relativeDirectory.includes(`PARTS/${this.props.partID}/CHOICES_ID`) && nodeItem.ext === ".md") {
          choices_id.push(nodeItem);
        }
        else if(nodeItem.relativeDirectory.includes(`PARTS/${this.props.partID}/ITEMS`) && nodeItem.ext === ".md") {
          if(nodeItem.relativeDirectory.includes(`PARTS/${this.props.partID}/ITEMS/${this.state.currentLanguage.split("-")[0]}`)) {
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
        else if(nodeItem.relativeDirectory.includes(`PARTS/${this.props.partID}`) && nodeItem.ext === ".md" && nodeItem.name === "part-info") {
          questionArrangement = nodeItem.childMarkdownRemark.frontmatter.arrangement;
        }
        else if(nodeItem.ext === ".md" && nodeItem.name === "index") {
          metadataItems = nodeItem;
        }
      }
    
        
      var disableChoices = [];
      if(this.props.prevSectionScores) {
        Object.keys(this.props.prevSectionScores).forEach((questionID) => {
          if(this.props.prevSectionScores[questionID] === 0) {
            disableChoices.push(questionID)
          }
        })
      }   
    
      var sections = {};
      var sectionNum = 0;
      var maxSectionNum = Math.max(Math.max(Math.max(parseInt(scores[scores.length - 1].name), parseInt(questions[questions.length - 1].name)), parseInt(choices[choices.length - 1].name)), parseInt(choices_id[choices_id.length - 1].name));
      var currentQuestion = null;
      var currentChoices = [];
      var currentChoicesID = [];
      var currentScore = [];
      var nextQuestionID = 0;
      var nextScoreID = 0;
      var nextChoiceID = 0;
      var nextChoiceIDID = 0;
      var allQuestions = {};
      while(sectionNum <= maxSectionNum) {
        if(nextQuestionID < questions.length && parseInt(questions[nextQuestionID].name) === sectionNum) {
          currentQuestion = questions[nextQuestionID].childMarkdownRemark;
          nextQuestionID++;
        }
    
        if(nextScoreID < scores.length && parseInt(scores[nextScoreID].name) === sectionNum) {
          currentScore = scores[nextScoreID].childMarkdownRemark.frontmatter.points;
          nextScoreID++;
        }
    
        if(nextChoiceID < choices.length && parseInt(choices[nextChoiceID].name) === sectionNum) {
          currentChoices = choices[nextChoiceID].childMarkdownRemark.frontmatter.choices;
          nextChoiceID++;
        }

        if(nextChoiceIDID < choices_id.length && parseInt(choices_id[nextChoiceIDID].name) === sectionNum) {
          currentChoicesID = choices_id[nextChoiceIDID].childMarkdownRemark.frontmatter.choices_id;
          nextChoiceIDID++;
        }
    
        var questionNum = questionArrangement[sectionNum].position
        sections[questionNum] = (<MultipleChoiceQuestion questionField={this.props.questionFields[this.state.currentLanguage]} disableChoices={disableChoices} question={currentQuestion} choices={currentChoices} currentItem={this.state.currentQuestionSelectedItem} updateSelectedItems={this.updateSelectedItems} updateCurrentScoreMatrix={(this.props.updateCurrentScoreMatrix) ? this.props.updateCurrentScoreMatrix : this.updateCurrentPartScoreMatrix} overallState={this.state} scores={currentScore} questionID={questionNum} questionName={questionArrangement[sectionNum].name} />)
        allQuestions[questionNum] = {"name": questionArrangement[sectionNum].name, "question": currentQuestion, "choices": currentChoices, "choicesID": currentChoicesID}
    
        sectionNum++;
      }
    
      if(Object.keys(this.state.selectedItems).length === 0) {
        Object.keys(sections).forEach((item) => {
          this.state.selectedItems[item] = -1;
        })
      }
    
      return(
        <Layout>
        <SEO title={metadataItems.childMarkdownRemark.frontmatter.title} />
        <section className="pt-3 mt-3 mb-5 main-background" style={{paddingBottom: "1in"}}>
          <section className="m-3 questionnaire-main" lang={currentLanguageCode}>
            <section className="questionnaire-contents">
              <SettingsWindow partID={this.props.partID} restartTest={this.props.restartTestMain} clearSelectedItems={this.clearSelectedItems} stateMain={this.props.stateMain} languageOptions={metadataItems.childMarkdownRemark.frontmatter.languages} changeLanguage={this.changeLanguage} currentLanguage={this.state.currentLanguage} />
              <section style={{textAlign: "center"}}>
                <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
                  {metadataItems.childMarkdownRemark.frontmatter.title}
                </ResponsiveHeader>
              </section>
              {sections[this.state.currentQuestion]}
              <QuestionToggle questionField={this.props.questionFields[this.state.currentLanguage]['question']} disableChoices={disableChoices} state={this.state} goToQuestion={this.goToQuestion} allQuestions={allQuestions} disableReviewAnswersButton={Object.values(this.state.selectedItems).includes(-1)} scores={(this.props.scores) ? this.props.scores : this.state.currentPartScoreMatrix} getResult={this.props.getResult} />
            </section>
          </section>
        </section>
        </Layout>
      )
    }
}