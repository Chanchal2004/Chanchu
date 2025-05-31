const express = require("express");
const uuid = require("uuid");
require("dotenv").config();
const { OpenAI } = require("openai");
const Interview = require("../model/interview");
const { UserModel } = require("../model/user");
const apiKey = process.env.APIKEY;

const openai = new OpenAI({ apiKey: apiKey });

const startingPrompt = {
  MERN: You will serve as an interviewer and I will be the interviewee candidate. You have to assess the interviewee's coding, conceptual skills related to the JD provided. Your task is to prepare a series of questions related to the job requirements and skills listed by the interviewee. Please ask each question one-by-one and wait for the interviewee to answer before providing feedback and grading the answer. After the interview, create a comprehensive report identifying areas of improvement, strengths, and an overall grade from 0 to 10.

  JD: MERN, MongoDB, Express, React and Node (Junior)
  Skills: Express, React, Node.,

  JAVA: You will serve as an interviewer and I will be the interviewee candidate. Assess the interviewee's coding and conceptual skills. Ask one question at a time, wait for an answer, then proceed. After the interview, create a report identifying areas of improvement, strengths, and a score from 0 to 10.

  JD: Java, SpringBoot
  Skills: Java, Spring Boot, Hibernate.,
};

const endInterviewPrompt = Stop the interview. Provide detailed feedback according to the feedbackSchema;

const startInterview = async (req, res, next) => {
  const { type } = req.body;
  try {
    const conversation = [{ role: "user", content: startingPrompt[type] }];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });

    const question = response.choices[0]?.message?.content;
    if (!question) throw new Error("Failed to generate interview question");

    const newInterview = new Interview({
      userId: req.userId,
      type: type,
      conversation: [...conversation, { role: "assistant", content: question }],
      feedback: null,
    });

    await newInterview.save();
    res.status(200).json({ msg: "Interview Started", question, newInterview });
  } catch (error) {
    console.error("Interview Start Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const EndInterview = async (req, res, next) => {
  const { conversation } = req.body;
  const { id } = req.params;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [...conversation, { role: "user", content: endInterviewPrompt }],
    });
    
    const endObj = response.choices[0]?.message?.content;
    if (!endObj) throw new Error("Failed to generate feedback");

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { conversation, feedback: endObj },
      { new: true }
    );

    res.status(200).json({ msg: "Interview Ended", feedback: endObj });
  } catch (error) {
    console.error("Interview End Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const AiResponse = async (req, res, next) => {
  const { conversation } = req.body;
  const { id } = req.params;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });

    const nextQuestion = response.choices[0]?.message?.content;
    if (!nextQuestion) throw new Error("Failed to generate next question");

    await Interview.findByIdAndUpdate(id, { conversation });

    res.json({ answer: nextQuestion });
  } catch (error) {
    console.error("AI Response Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  endInterviewPrompt,
  startingPrompt,
  EndInterview,
  startInterview,
  AiResponse,
};