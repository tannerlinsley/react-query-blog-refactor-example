import React from 'react'
import App from 'next/app'
import { createGlobalStyle } from 'styled-components'
import normalize from 'styled-normalize'

//

const GlobalStyles = createGlobalStyle`
  ${normalize};
  html, body, body, [data-reactroot] {
    min-height: 100%;
    width: 100%;
  }

  html, body {
    font-size: 16px;
    font-family: "Helvetica", "Georgia", sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <GlobalStyles />
        <Component {...pageProps} />
      </>
    )
  }
}
