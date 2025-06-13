import React, { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    text: "How satisfied are you with our products?",
    type: "rating",
    scale: 5,
  },
  {
    id: 2,
    text: "How fair are the prices compared to similar retailers?",
    type: "rating",
    scale: 5,
  },
  {
    id: 3,
    text: "How satisfied are you with the value for money of your purchase?",
    type: "rating",
    scale: 5,
  },
  {
    id: 4,
    text: "On a scale of 1-10 how would you recommend us to your friends and family?",
    type: "rating",
    scale: 10,
  },
  {
    id: 5,
    text: "What could we do to improve our service?",
    type: "text",
  },
];

const generateSessionId = () => `session-${Date.now()}`;

export default function SurveyApp() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!sessionId) setSessionId(generateSessionId());
  }, [sessionId]);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[current].id]: value });
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const skip = () => {
    next();
  };

  const submit = () => {
    const result = {
      sessionId,
      answers,
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(sessionId, JSON.stringify(result));
    setCompleted(true);
    setTimeout(() => {
      setStarted(false);
      setCurrent(0);
      setAnswers({});
      setCompleted(false);
      setSessionId(generateSessionId());
    }, 5000);
  };

  if (!started) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Welcome to our Customer Survey</h1>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded"
            onClick={() => setStarted(true)}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-2xl">Thank you for your time!</h2>
      </div>
    );
  }

  const question = questions[current];
  const currentAnswer = answers[question.id] || "";

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-4 text-right">{`${current + 1}/${questions.length}`}</div>
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      {question.type === "rating" ? (
        <div className="flex gap-2 mb-4">
          {[...Array(question.scale)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentAnswer === i + 1 ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          className="w-full border p-2 mb-4"
          rows="4"
          value={currentAnswer}
          onChange={(e) => handleAnswer(e.target.value)}
        ></textarea>
      )}
      <div className="flex justify-between">
        <button
          onClick={prev}
          className="bg-gray-300 px-4 py-2 rounded"
          disabled={current === 0}
        >
          Previous
        </button>
        <button onClick={skip} className="bg-yellow-300 px-4 py-2 rounded">
          Skip
        </button>
        {current === questions.length - 1 ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={next}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
      </div>
      {showConfirm && (
        <div className="mt-4 p-4 border bg-gray-100 rounded">
          <p>Are you sure you want to submit?</p>
          <div className="mt-2 flex gap-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={submit}
            >
              Yes
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
