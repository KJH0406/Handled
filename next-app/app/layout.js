import "./globals.css"

export const metadata = {
  title: "Handled — Korean local experiences",
  description: "Discover authentic Korean local experiences hosted by people you trust.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
