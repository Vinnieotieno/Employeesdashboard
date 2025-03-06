import React, { useState, useEffect } from 'react';

const TypingText = ({ texts, className}) => {
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [letter, setLetter] = useState('');

  useEffect(() => {
    let timeout;

    function type() {
      const currentText = texts[count];

      if (index < currentText.length) {
        setLetter(currentText.slice(0, index + 1));
        setIndex(index + 1);
      } else if (count < texts.length - 1) {
        setCount(count + 1);
        setIndex(0);
      } else {
        setCount(0);
        setIndex(0);
      }

      timeout = setTimeout(type, 150);
    }

    timeout = setTimeout(type, 150);

    return () => clearTimeout(timeout);
  }, [count, index, texts]);

  return <span className={`typing ${className}`} >{letter}</span>;
};

export default TypingText;
