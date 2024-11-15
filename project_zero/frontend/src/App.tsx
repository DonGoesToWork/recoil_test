import "./App.css";

import Main from "./Components/Main";
import { ToastProvider } from "./Components/Toast/ToastContainer";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Main />
    </ToastProvider>
  );
};

export default App;
