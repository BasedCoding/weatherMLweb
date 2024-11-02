import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="feedback-container">
      <h1>Feedback</h1>
      {submitted ? (
        // Message if form submitted
        <p>Thank you for your feedback!</p>
      ) : (
        // Feedback form if not submitted
        <form onSubmit={handleSubmit} className="feedback-form">
          <label>
            Rate your experience:
            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
              <option value="">Select</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </label>

          <label>
            Your Feedback:
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here"
              required
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Feedback;
