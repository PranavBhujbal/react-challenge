import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dog from "./pages/Dog"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:name" element={<Dog />}></Route>
        </Routes></BrowserRouter>
    </>
  );
}

export default App;
