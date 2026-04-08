import { RouterProvider } from "react-router"
import { router } from "./app.routers.jsx"
import './App.css'
import { Authprovider } from "./features/auth/auth.context.jsx"

function App() {
  return (
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>
  )
}
export default App