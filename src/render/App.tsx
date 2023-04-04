//import Routes from "./Routes";//
import { store, persistor } from "@redux/index";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { Routes, Route, HashRouter } from "react-router-dom";
import HomePage from "@/render/containers/homepage/index";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
