import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";
import { AppDispatch } from "../../redux/store";

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
        <Container>
            <Box sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
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
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
