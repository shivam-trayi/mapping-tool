import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import { Toaster } from "./components/ui/toaster";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster /> 
      </PersistGate>
    </Provider>
  );
};

export default App;
