import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import APIService from "../services/APIService";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert,
  Box,
} from "@mui/material";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await APIService.login(username, password);
      localStorage.setItem("token", response.token);
      setMessage({ type: "success", content: "Login successful!" });
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        content: "Login failed, wrong credentials!",
      });
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 30, textAlign: "center" }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Button
              onClick={() => navigate(-1)}
              style={{ marginRight: "auto" }}
            >
              Back
            </Button>
            <Typography variant="h3" style={{ flexGrow: 1 }}>
              Sign In
            </Typography>
          </Box>
          <Box mt={2}>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                fullWidth
              >
                Sign In
              </Button>
            </Box>
            {message && (
              <Box mt={2}>
                <Alert severity={message.type}>{message.content}</Alert>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
