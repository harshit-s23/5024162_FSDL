import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Success from "./components/Success";
import Users from "./components/Users";
import "./App.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;