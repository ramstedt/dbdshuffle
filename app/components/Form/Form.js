'use client';
import styles from './Form.module.css';
import { useState, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Form() {
  const [formData, setFormData] = useState({ message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRecaptchaChange = (v) => {
    setRecaptchaValue(v);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisableButton(true);

    if (!recaptchaValue) {
      setStatus({ type: 'error', message: 'Please complete the reCAPTCHA.' });
      setDisableButton(false);
      return;
    }

    const requestData = {
      message: formData.message,
      captchaToken: recaptchaValue,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (result.success) {
        setStatus({ type: 'success', message: 'Message sent successfully' });
      } else {
        setStatus({
          type: 'warning',
          message: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setFormData({ message: '' });
      recaptchaRef.current.reset();
      setDisableButton(false);
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? 'Close' : 'Report Feedback'}
      </button>

      {isFormVisible && (
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formMessage}>
            <label htmlFor='message'>
              Please leave any feedback or bug reports here:
            </label>
            <textarea
              value={formData.message}
              name='message'
              onChange={handleChange}
              id='message'
              required
              placeholder='Write a message'
            ></textarea>
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />

          <div>
            <button type='submit' disabled={disableButton}>
              {disableButton ? (
                <ClipLoader
                  size={15}
                  color='#F5F5F5'
                  aria-label='Loading Spinner'
                  data-testid='loader'
                />
              ) : (
                'Send Feedback'
              )}
            </button>
          </div>
          {status.message && (
            <p className={styles.statusMessage}>{status.message}</p>
          )}
        </form>
      )}
    </div>
  );
}
