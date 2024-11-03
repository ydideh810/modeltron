import type { ChatMessage } from '../types';

const RESPONSES = {
  START: (name: string) => `Welcome, ${name}! I am TUTOR-8000, your learning companion.
I am here to assist you in your educational journey.

You can:
1. Ask questions about any topic
2. Upload documents for analysis
3. Practice problem-solving
4. Track your learning progress

What would you like to learn about today?`,
  
  UNKNOWN: `I apologize, but I don't understand that command.
Try 'HELP' for a list of available commands.`,
  
  HELP: `Available commands:
- START {name}: Begin your learning session
- LEARN {topic}: Start learning about a topic
- PRACTICE {subject}: Begin practice exercises
- STATUS: View your learning progress
- HELP: Display this help message`,
};

export const generateResponse = (input: string): ChatMessage => {
  const normalizedInput = input.trim().toUpperCase();
  
  if (normalizedInput.startsWith('START')) {
    const name = input.split(' ')[1] || 'STUDENT';
    return {
      role: 'assistant',
      content: RESPONSES.START(name)
    };
  }
  
  if (normalizedInput === 'HELP') {
    return {
      role: 'assistant',
      content: RESPONSES.HELP
    };
  }
  
  // Simulate topic-based responses
  if (normalizedInput.startsWith('LEARN')) {
    const topic = input.split(' ').slice(1).join(' ');
    return {
      role: 'assistant',
      content: `Initiating learning module for: ${topic}\n\nGenerating educational content...\n\nThis is a simulated response. In a real application, this would provide actual educational content about ${topic}.`
    };
  }

  return {
    role: 'assistant',
    content: RESPONSES.UNKNOWN
  };
};

export const generateDocumentSummary = (text: string): string => {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  
  return `DOCUMENT ANALYSIS COMPLETE
======================
Length: ${words} words
Sentences: ${sentences}
Estimated reading time: ${Math.ceil(words / 200)} minutes

SUMMARY
-------
${text.slice(0, 300)}...

RECOMMENDATIONS
--------------
1. Review key concepts
2. Take notes on main ideas
3. Practice related exercises`;
};