import { useState } from 'react';
import StarRating from './StarRating';
import PropTypes from 'prop-types';

const AddReview = ({ onSubmit, existingReview, onCancel, isLoading }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.review || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setError('');
    onSubmit({ rating, review: reviewText });
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #d5d9d9',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <style>{`
        .amazon-review-form-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 20px;
        }

        .amazon-form-group {
          margin-bottom: 20px;
        }

        .amazon-form-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 8px;
        }

        .amazon-form-required {
          color: #c45500;
        }

        .amazon-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #888c8c;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Amazon Ember', Arial, sans-serif;
          color: #0f1111;
          resize: vertical;
          min-height: 100px;
          box-sizing: border-box;
        }

        .amazon-textarea:focus {
          outline: none;
          border-color: #007185;
          box-shadow: 0 0 0 3px rgba(228, 121, 17, 0.5);
        }

        .amazon-textarea::placeholder {
          color: #888c8c;
        }

        .amazon-char-count {
          font-size: 12px;
          color: #565959;
          margin-top: 4px;
          text-align: right;
        }

        .amazon-form-error {
          color: #c40000;
          font-size: 13px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .amazon-form-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .amazon-submit-button {
          background-color: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #0f1111;
          cursor: pointer;
          transition: background-color 0.2s;
          box-shadow: 0 2px 5px 0 rgba(213,217,217,.5);
        }

        .amazon-submit-button:hover:not(:disabled) {
          background-color: #f7ca00;
          border-color: #f2c200;
        }

        .amazon-submit-button:disabled {
          background-color: #f0f0f0;
          border-color: #d5d9d9;
          color: #888c8c;
          cursor: not-allowed;
        }

        .amazon-cancel-button {
          background-color: #ffffff;
          border: 1px solid #d5d9d9;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #0f1111;
          cursor: pointer;
          transition: background-color 0.2s;
          box-shadow: 0 2px 5px 0 rgba(213,217,217,.5);
        }

        .amazon-cancel-button:hover:not(:disabled) {
          background-color: #f7f8f8;
        }

        .amazon-cancel-button:disabled {
          background-color: #f0f0f0;
          color: #888c8c;
          cursor: not-allowed;
        }

        .amazon-rating-section {
          background-color: #f7f9fa;
          border: 1px solid #e7e7e7;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .amazon-rating-hint {
          font-size: 13px;
          color: #565959;
          margin-top: 8px;
        }
      `}</style>

      <h3 className="amazon-review-form-title">
        {existingReview ? 'Edit Your Review' : ''}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="amazon-form-group">
          <label className="amazon-form-label">
             {/* <span className="amazon-form-required">*</span> */}
          </label>
          {error && (
            <div className="amazon-form-error">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="amazon-form-group">
          <label className="amazon-form-label">
            Add a written review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="amazon-textarea"
            rows="6"
            maxLength="1000"
            placeholder="What did you like or dislike? What did you use this product for?"
          />
          <div className="amazon-char-count">
            {reviewText.length}/1000
          </div>
          <div className="amazon-rating-section">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              readonly={false}
              size={32}
              showNumber={false}
            />
            <div className="amazon-rating-hint">
              {rating === 0
                ? 'Select a rating'
                : rating === 1
                ? 'Very Poor'
                : rating === 2
                ? 'Poor'
                : rating === 3
                ? 'Average'
                : rating === 4
                ? 'Good'
                : 'Excellent'}
            </div>
          </div>
        </div>

        <div className="amazon-form-buttons">
          <button
            type="submit"
            disabled={isLoading}
            className="amazon-submit-button"
          >
            {isLoading ? 'Submitting...' : existingReview ? 'Update review' : 'Submit review'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="amazon-cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

AddReview.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  existingReview: PropTypes.shape({
    rating: PropTypes.number,
    review: PropTypes.string,
  }),
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default AddReview;
