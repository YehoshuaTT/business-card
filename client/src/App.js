import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UnProtectedRout from "./components/UnProtectedRout";
import ProtectedRout from "./components/ProtectedRout";
import { useEffect, useState } from "react";
import { HttpService } from "./services/httpService";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateCard from "./pages/CreateCard";

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const authorization = async () => {
      if (authorized) return;
      const user = await HttpService.autorized();
      if (user) {
        setAuthorized(true);
        setUserId(user._id);
      }
    };
    authorization();
  }, [authorized]);

  return (
    <div className="app">
      <BrowserRouter>
        <Header authorized={authorized} setAuthorized={setAuthorized} />
        <Routes>
          <Route
            path="/"
            element={<HomePage authorized={authorized} userId={userId} />}
          />

          <Route
            path="/login"
            element={<UnProtectedRout authorized={authorized} />}
          >
            <Route
              path="/login"
              element={<Login setAuthorized={setAuthorized} />}
            />
            <Route
              path="/login/register"
              element={<Register setAuthorized={setAuthorized} />}
            />
          </Route>

          <Route
            path="/create"
            element={<ProtectedRout authorized={authorized} />}
          >
            <Route path="/create" element={<CreateCard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
