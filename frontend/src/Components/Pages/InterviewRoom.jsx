import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TextToSpeech } from "./TextToSpeech";
import { Latest_Message } from "../redux/actionType";

export const InterviewRoom = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [conversation, setConversation] = useState([]);
  const [interview, setInterview] = useState(null);
  const type = useSelector((store) => store.authReducer.type);
  const [cameraStatus, setCameraStatus] = useState("pending");
  const [micStatus, setMicStatus] = useState("pending");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    checkPermissions();
    startListening();
  }, []);

  const checkPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStatus("allowed");
    } catch (error) {
      setCameraStatus("denied");
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("allowed");
    } catch (error) {
      setMicStatus("denied");
    }
  };

  const startInterview = async () => {
    if (!type) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/interview/start`,
        { type },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setConversation((prev) => [...prev, { role: "assistant", content: response.data.question }]);
      dispatch({ type: Latest_Message, payload: response.data.question });
      setInterview(response.data.newinterview);
      startRecording();
    } catch (error) {
      console.error("Interview Start Error:", error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };
        mediaRecorderRef.current.start();
      })
      .catch(() => console.error("Microphone Access Error"));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStop = async () => {
    if (!interview) return;
    stopRecording();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/interview/end/${interview._id}`,
        { conversation },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({
        type: Latest_Message,
        payload: "Interview completed! Click 'End Interview' to see your feedback.",
      });
    } catch (error) {
      console.error("Interview Stop Error:", error);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setConversation((prev) => [...prev, { role: "user", content: transcript }]);
    };

    recognition.start();
  };

  const exitInterviewRoom = () => {
    navigate("/userdashboard");
  };

  return (
    <div className="min-h-screen flex justify-between pt-24 pb-7 pl-4">
      <div className="relative flex-grow bg-gray-200">
        <div className="py-20 px-4 relative">
          {cameraStatus === "denied" && (
            <div className="bg-red-500 text-white p-4 rounded-md">
              🚫 Camera access denied! Please enable camera permissions.
            </div>
          )}

          <div className="flex gap-4">
            <div className="relative border-2 w-1/2 h-96 rounded-lg border-blue-500">
              <img className="absolute w-40 h-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="https://herobot.app/wp-content/uploads/2022/11/AI-bot-1.jpg" alt="AI Avatar" />
            </div>

            <div className="relative border-2 w-1/2 h-96 rounded-lg border-gray-50 overflow-hidden">
              {cameraStatus === "allowed" ? (
                <Webcam ref={webcamRef} audio={true} videoConstraints={{ facingMode: "user" }} />
              ) : (
                <div className="text-center text-red-600 font-bold p-4">🚫 Camera Blocked</div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={startInterview} className="bg-black text-white py-2 px-4 rounded-md border">Start Interview</button>
            <button onClick={handleStop} className="bg-red-500 text-white py-2 px-4 rounded-md border">Stop</button>
            <button onClick={exitInterviewRoom} className="bg-black text-white py-2 px-4 rounded-md border">End Interview</button>
          </div>
        </div>
      </div>

      <TextToSpeech conversation={conversation} setConversation={(msg) => setConversation((prev) => [...prev, msg])} interview={interview} />
    </div>
  );
};
