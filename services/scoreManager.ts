
import { HighScoreEntry } from '../types';

const HIGH_SCORE_KEY = 'fluffyDogHighScores';
const MAX_SCORES = 10;

export const getHighScores = (): HighScoreEntry[] => {
  try {
    const scoresJSON = localStorage.getItem(HIGH_SCORE_KEY);
    if (!scoresJSON) return [];
    const scores = JSON.parse(scoresJSON) as HighScoreEntry[];
    // Just in case data is malformed
    if (!Array.isArray(scores)) return [];
    return scores;
  } catch (error) {
    console.error("Error reading high scores from localStorage", error);
    return [];
  }
};

export const addHighScore = (score: number): void => {
  if (score <= 0) return;
  
  const newEntry: HighScoreEntry = {
    score,
    date: new Date().toLocaleDateString(),
  };

  const scores = getHighScores();
  scores.push(newEntry);
  
  scores.sort((a, b) => b.score - a.score);
  
  const newScores = scores.slice(0, MAX_SCORES);

  try {
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(newScores));
  } catch (error) {
    console.error("Error saving high scores to localStorage", error);
  }
};
