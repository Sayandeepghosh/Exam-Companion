export type Page = 'Home' | 'Exams' | 'Revision' | 'Quiz' | 'Notes' | 'Tables' | 'Formulas' | 'Puzzles' | 'Progress' | 'Testbook' | 'Focus';

export interface Exam {
  id: number;
  name: string;
  date: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  // Simplified Spaced Repetition
  nextReviewDate: number; // timestamp
  easeFactor: 'Hard' | 'Good' | 'Easy';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  date: number; // timestamp
  score: number;
  totalQuestions: number;
  topic: string;
  aiSuggestion?: string;
}

export interface Formula {
  id: number;
  topic: string;
  content: string;
}

export type NoteBlockType = 'text' | 'image' | 'audio';

export interface NoteBlock {
  id: number;
  type: NoteBlockType;
  content: string; // text content, base64 for image, or base64 for audio
}

export interface Note {
  id: number;
  title: string;
  blocks: NoteBlock[];
  createdAt: number;
}