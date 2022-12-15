import { useState } from 'react';

import styles from '../styles/ChatInput.module.scss';

export const ChatInput = () => {

    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {

        e.preventDefault();

        // Check for empty input

        if (message.trim().length === 0) return;

        setMessage('');

    }

    const handleEnter = (e) => {

        if (message.trim().length === 0) return;

        // Check if Enter key is pressed
        
        if (e.keyCode === 13) {

            e.preventDefault();
            
            setMessage('');

        }

    }

  return (

    <form onSubmit={handleSubmit} onKeyDown={handleEnter} className={styles.form}>
    
        <textarea name='chat-input' placeholder='Type a message' value={message} onChange={(e) => setMessage(e.target.value)} className={styles.textarea} />

        <button type='submit' className={styles['submit-btn']}>Send</button>

    </form>
  
  )

}