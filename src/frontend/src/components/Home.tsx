import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIService from "../services/APIService";
import { Button, Typography, Grid, Paper, Box, Alert } from "@mui/material";

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await APIService.fetchUser();
        setUser(userData);
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
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
          {user ? (
            <Box>
              <Typography variant="h3">Welcome {user.username}</Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogOut}
                  style={{ marginLeft: 10 }}
                >
                  Log out
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h3">Welcome New User</Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/login")}
                  style={{ marginRight: 10 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </Box>
            </Box>
          )}
          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
