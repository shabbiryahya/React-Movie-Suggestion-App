import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </Provider>
  );
}

export default App;
