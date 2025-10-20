import React from "react"
import {Container, Stack} from 'react-bootstrap'
import Header from "./header"
import { useStaticQuery, graphql } from "gatsby"
import ResponsiveSize from "../hooks/responsive-size";

export default function Layout({ menuBarItems, children, showMenuBar }) {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title,
            author
          }
        }
      }
    `
  )
  return (
    <div>
      <Container fluid className="p-0 main">
          <Stack className="justify-content-center">
            <Header siteTitle={data.site.siteMetadata.title} />
            <main>{children}</main>
          </Stack>
      </Container>
      <Container fluid className="px-0 main-navbar" style={{bottom: 0, position: `fixed`, width:`100%`, zIndex:`100`}}>
        <Stack>
          <div className="footer-col">
            <footer>
              <span style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}}>
                <small><b>{`© ${new Date().getFullYear()} ${data.site.siteMetadata.author}`}</b></small>
              </span>
            </footer>
          </div>
        </Stack>
      </Container>
    </div>
  )
}