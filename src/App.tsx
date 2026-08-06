import { Route, Routes } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";

function App() {
  

  return (
    <>
    <Sidebar/>
    <Routes>
      <Route path="/" element={<Hero/>}/>
    </Routes>
    </>
  )
}

export default App
