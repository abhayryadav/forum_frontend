import './globals.css'

export const metadata = {
  title: 'Task Manager',
  description: 'Manage tasks with comments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}