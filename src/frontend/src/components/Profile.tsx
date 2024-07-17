import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../assets/user.jpg";
import APIService from "../services/APIService";
import { Button, Typography, Grid, Paper, Alert, Box } from "@mui/material";

const Profile: React.FC = () => {
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
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRecord = () => {
    navigate("/audiorecorder");
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
          <img src={userProfile} width={200} alt="User Profile" />
          <Typography variant="h3">User Profile</Typography>
          <Box mt={2}>
            <Typography variant="h4">{user?.username}</Typography>
            <Typography variant="body2">{user?.motto}</Typography>
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handleRecord}
              style={{ marginRight: 20 }}
            >
              Record New Motto
            </Button>
            <Button variant="contained" onClick={handleLogOut}>
              Log out
            </Button>
          </Box>
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

export default Profile;
