import { useState } from 'preact/hooks';

export default function Greeting({messages}) {
  const generateIndex = () => {
    return Math.floor(Math.random() * messages.length);
  };

  const randomMessage = () => {
    let index = generateIndex();
    return messages[index];
  };

  const [greeting, setGreeting] = useState(messages[generateIndex()]);

  return (
    <div>
      <h3>{greeting}! Thank you for visiting!</h3>
      <button onClick={() => setGreeting(randomMessage())}>
        New Greeting
      </button>
    </div>
  );
}