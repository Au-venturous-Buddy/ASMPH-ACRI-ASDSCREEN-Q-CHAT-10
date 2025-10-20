import React, {useState} from "react"
import Layout from "./layout"
import SEO from "./seo"
import { Form, Button } from "react-bootstrap";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import SettingsWindow from "./settings-window";
import ShowAudio from "./show-audio";

export default function SetLanguageAudioMain(props) {
    const [currentLanguage, setCurrentLanguage] = useState("English");
    
    const startTestMain = () => {
      props.stateMain.changeLanguageHistory.push(currentLanguage);
      props.startTest(currentLanguage);
    }

    const changeLanguage = () => {
      var language = document.getElementById(`language-selector`).value;
      setCurrentLanguage(language);
    }

    const changeLanguageSettings = (partID) => {
      var language = document.getElementById(`language-selector-${partID}`).value;
      setCurrentLanguage(language);
    }
    
    const clearAllFields = () => {
      setCurrentLanguage("English");
      document.getElementById("language-selector").value = "English";

      props.restartTestMain();
    }

    var metadataItems = null;
    for(var i = 0; i < props.data.allFile.edges.length; i++) {
      var nodeItem = props.data.allFile.edges[i].node

      if(nodeItem.ext === ".md" && nodeItem.name === "index") {
        metadataItems = nodeItem;
        break;
      }
    }

    return(
        <Layout>
        <SEO title={metadataItems.childMarkdownRemark.frontmatter.title} />
        <section className="pt-3 mt-3 mb-5 main-background" style={{paddingBottom: "1in"}}>
          <section lang={props.patientInfoFields[currentLanguage]["language_code"]} className="questionnaire-main m-3">
            <section className="questionnaire-contents">
            <SettingsWindow partID="set-language-audio" restartTest={clearAllFields} clearSelectedItems={clearAllFields} currentLanguage={currentLanguage} languageOptions={metadataItems.childMarkdownRemark.frontmatter.languages} changeLanguage={changeLanguageSettings} />
            <section style={{textAlign: "center"}} className="mb-3">
              <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
                {metadataItems.childMarkdownRemark.frontmatter.title}
              </ResponsiveHeader>
              <section aria-label={props.patientInfoFields[currentLanguage]["field_names"]["instructions"]["text"].replace(/<[\/]?p(.*?)>/gm, "").replace(/<[\/]?iframe(.*?)>/gm, "").replace(/<[\/]?strong>/gm, "").replace(/<br(.*?)>/gm, " ")}>
                <section style={{textAlign: "left"}}>
                  <article aria-hidden className="mt-3" dangerouslySetInnerHTML={{__html: props.patientInfoFields[currentLanguage]["field_names"]["instructions"]["text"]}}></article>
                  <ShowAudio audioLink={props.patientInfoFields[currentLanguage]["field_names"]["instructions"]["audio"]} />
                </section>
              </section>
            </section>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="language-selector">
                    Language:
                </Form.Label>
                <Form.Select className="text-input" id="language-selector" onChange={changeLanguage} value={currentLanguage}>
                    {metadataItems.childMarkdownRemark.frontmatter.languages.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Form.Group style={{textAlign: "center"}}>
                <Button style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} onClick={startTestMain}>Start Test</Button>
              </Form.Group>
            </Form>
          </section>
        </section>
      </section>
    </Layout>
  )
}