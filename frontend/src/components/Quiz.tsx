import { useState } from 'react';
import { QuizQuestion } from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
    questions: QuizQuestion[];
    title: string;
    onComplete: (score: number) => void;
    passed?: boolean;
    previousScore?: number;
}

export default function Quiz({ questions, title, onComplete, passed, previousScore }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(passed !== undefined ? true : false);
    const [finalScore, setFinalScore] = useState(previousScore || 0);

    if (!questions || questions.length === 0) {
        return <div className="text-muted py-8 text-center">No quiz available for this course.</div>;
    }

    const currentQuestion = questions[currentIndex];

    const handleNext = () => {
        if (selectedOption === null) return;

        let newScore = score;
        if (selectedOption === currentQuestion.correctAnswerIndex) {
            newScore++;
            setScore(newScore);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
        } else {
            const calculatedScore = Math.round((newScore / questions.length) * 100);
            setFinalScore(calculatedScore);
            setIsFinished(true);
            onComplete(calculatedScore);
        }
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setIsFinished(false);
    };

    if (isFinished) {
        const isPassed = passed ?? finalScore >= 80;
        return (
            <div className="quiz-container glass-panel card-base text-center" style={{ padding: '3rem 2rem' }}>
                {isPassed ? (
                    <div style={{ color: 'var(--color-success)' }}>
                        <CheckCircle size={64} style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Quiz Passed!</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Score: {finalScore}%</p>
                        <p className="text-muted">Congratulations, you have completed this course!</p>
                    </div>
                ) : (
                    <div style={{ color: 'var(--color-danger)' }}>
                        <XCircle size={64} style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Quiz Failed</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Score: {finalScore}% (Requires 80%)</p>
                        <button className="primary-solid" onClick={resetQuiz} style={{ margin: '0 auto' }}>
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="quiz-container glass-panel card-base" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title} - Final Quiz</h2>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}>
                    Question {currentIndex + 1} of {questions.length}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.4 }}>
                    {currentQuestion.question}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {currentQuestion.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedOption(i)}
                            style={{
                                textAlign: 'left',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: `2px solid ${selectedOption === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'}`,
                                background: selectedOption === i ? 'rgba(139, 92, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                border: `2px solid ${selectedOption === i ? 'var(--color-primary)' : 'var(--text-muted)'}`,
                                position: 'relative',
                                flexShrink: 0
                            }}>
                                {selectedOption === i && <div style={{ width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px' }} />}
                            </div>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button
                    className="primary-solid"
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    style={{ padding: '0.75rem 2rem', fontSize: '1.05rem' }}
                >
                    {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}
