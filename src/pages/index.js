import React from "react"
import { graphql } from "gatsby"
import SetLanguageAudio from "./set-language-audio"

export default class QCHATMain extends React.Component {
  state = {
    mainTestScoreMatrix: {},
    mainTestAnswerSummary: {},
    currentPart: null,
    changeLanguageHistory: []
  }

  updateMainTestScoreMatrix = (score, questionID) => {
    this.state.mainTestScoreMatrix[questionID] = score;
  }

  updateMainTestAnswerSummary = (contents, questionID) => {
    this.state.mainTestAnswerSummary[questionID] = contents;
  }

  changePart = (nextPart) => {
    this.setState({currentPart: nextPart})
  }

  restartTestMain = () => {
    this.state.mainTestScoreMatrix = {}
    this.state.mainTestAnswerSummary = {}
    this.state.changeLanguageHistory = []
    this.setState({currentPart: null})
  }

  render() {
    return(
      <>
        {
          (this.state.currentPart === null) ?
          (<SetLanguageAudio data={this.props.data} stateMain={this.state} changePart={this.changePart} restartTestMain={this.restartTestMain} updateMainTestScoreMatrix={this.updateMainTestScoreMatrix} updateMainTestAnswerSummary={this.updateMainTestAnswerSummary} />) :
          (this.state.currentPart)
        }
      </>
    )
  }
}

export const query = graphql`
query {
  allFile(
    filter: {relativeDirectory: {regex: "/assets/*/"}}
    sort: {relativePath: ASC}
  ) {
    edges {
      node {
        name
        ext
        relativeDirectory
        publicURL
        childMarkdownRemark {
          html
          frontmatter {
            title
            language_code
            choices {
              text
              audio
            }
            choices_id
            points
            arrangement {
              position
              name
            }
            languages
            audio
          }
          internal {
            content
          }
        }
      }
    }
  }
}
`