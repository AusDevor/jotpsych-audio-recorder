import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import APIService from "../services/APIService";
import { Button, Typography, Grid, Paper, Box } from "@mui/material";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await APIService.fetchUser();
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);

  const handleStartRecording = async () => {
    setIsRecording(true);
    setMessage(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        await uploadAudio(audioBlob);
      };
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      const response = await APIService.uploadAudio(audioBlob);
      setMessage("Audio uploaded successfully!");
      console.log(response.data.message);
    } catch (err) {
      setMessage("Failed to upload audio.");
      console.error("Failed to upload audio:", err);
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
          <Typography variant="h3">Audio Recorder</Typography>
          <Box mt={2}>
            {isRecording ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleStopRecording}
              >
                Stop Recording
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartRecording}
              >
                Start Recording
              </Button>
            )}
          </Box>
          {audioURL && (
            <Box mt={2}>
              <audio controls src={audioURL}></audio>
            </Box>
          )}
          {message && (
            <Box mt={2}>
              <Typography>{message}</Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AudioRecorder;
