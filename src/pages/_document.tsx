import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html className="dark scrollbar scrollbar-thumb-green-50 scrollbar-track-green-400 scroll-smooth">
      <Head>
        <link
          rel="stylesheet"
          href="https://kit-pro.fontawesome.com/releases/v6.1.1/css/pro.css"
        />
      </Head>
      <body className="min-h-screen bg-light-background text-light-primary transition-colors selection:bg-green-300 selection:text-light-primary dark:bg-dark-background dark:text-dark-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
