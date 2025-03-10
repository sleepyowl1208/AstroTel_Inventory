import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { ThemeProviderComponent } from "./context/ThemeContext";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProviderComponent>
				<App />
			</ThemeProviderComponent>
		</Provider>
	</React.StrictMode>
);
