import { JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import { RootState } from "./redux/store";
import "./styles/theme.css";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem("token");
	return token ? children : <Navigate to="/login" replace />;
};


const App = () => {
	const { token } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		console.log("Token:", token); // Debugging purpose
	}, [token]);

	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
				{/* <Route path="/customer-details/:accountId" element={<CustomerDetails />} /> */}
				<Route path="/customer/:accountId" element={<CustomerDetails />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</Router>
	);
};

export default App;
