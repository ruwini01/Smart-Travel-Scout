import "./globals.css";

export const metadata = {
  title: "Smart Travel Scout",
  description: "AI-powered Sri Lanka travel experience finder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23E8192C'/><circle cx='50' cy='50' r='38' fill='none' stroke='white' stroke-width='4'/><polygon points='67,33 58,58 33,67 42,42' fill='white'/></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}