import { Box, Button, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BioMetric from "../../assets/icons/biometric-login.svg";
import TeliaLogo from "../../assets/icons/telia_logo.svg";
import LoginImage from "../../assets/images/loginPage3.png";
import { loginUser } from "../../features/auth/authSlice";
import { AppDispatch } from "../../redux/store";
import "./auth.css";




interface LoginFormInputs {
    email: string;
    password: string;
}


const Login = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    // Prevent back navigation to login after successful login
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard", { replace: true }); // Redirect if already logged in
        }

        const preventBackNavigation = () => {
            window.history.pushState(null, "", window.location.href);
        };

        // Block back navigation
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", preventBackNavigation);

        return () => {
            window.removeEventListener("popstate", preventBackNavigation);
        };
    }, [navigate]);

    const onSubmit = async (data: LoginFormInputs) => {
        setLoading(true);
        setError(null);

        try {
            const response = await dispatch(loginUser(data)).unwrap();
            if (response?.access_token) {
                localStorage.setItem("token", response.access_token);
                localStorage.setItem("role", response.role);
                navigate("/dashboard", { replace: true }); // 🚀 Immediate redirection
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError(typeof err === "string" ? err : "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid sx={{ height: "100vh", display: { xs: "none", md: "block" } }} size={{ xs: 0, md: 8 }}>
                    <img src={LoginImage} alt="Login Image" height="100%" width="100%" className="login-image" />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}
                    sx={{
                        height: "100vh",
                        display: { xs: "flex" },
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <img src={TeliaLogo} className="official-logo" />
                    </Box>
                    <Box sx={{ margin: "auto", px: 0, m: 2.5, boxShadow: 0, borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={600}>Login</Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                className="login-input-field"
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 4, message: "Password must be at least 4 characters" },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                className="login-input-field"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2, boxShadow: "0" }}
                                disabled={loading}
                                className="btn--primary-light"
                            >
                                {loading ? <CircularProgress size={24} /> : "Login"}
                            </Button>
                        </form>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ my: 2, display: "flex", justifyContent: "space-between" }}>
                            <Button
                                type="submit"
                                variant="outlined"
                                disabled={loading}
                                fullWidth
                                className="btn--primary-light"
                                sx={{ mr: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Telia SSO Login"}
                            </Button>
                            <Button variant="outlined" className="btn--primary-light">
                                {/* <span>Biometric Login</span> */}
                                <img src={BioMetric} alt="biometric-login" height="32" width="32" className="biometric-login-icon" />
                            </Button>
                        </Box>

                        <Box sx={{ my: 2 }}>

                        </Box>
                    </Box>
                    <Box sx={{ p: 2 }}>© 2025 Telia Sweden.</Box>
                </Grid>

            </Grid>
        </Box >
    );
};

export default Login;
