import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeData, distillData } from './api/client';

import { ThemeProvider } from './components/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function AppContent() {
    const [analysis, setAnalysis] = useState(null);
    const [distillResult, setDistillResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [distilling, setDistilling] = useState(false);
    const [error, setError] = useState('');
    const [currentFileContent, setCurrentFileContent] = useState(null); // Temporarily store content for 2-step process

    const handleFileSelect = async ({ name, content }) => {
        setLoading(true);
        setError('');
        setAnalysis(null);
        setDistillResult(null);
        setCurrentFileContent(content);

        try {
            // Step 1: Analyze
            const result = await analyzeData(content);
            setAnalysis(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDistill = async () => {
        if (!analysis || !currentFileContent) return;

        setDistilling(true);
        setError('');

        try {
            // Step 2: Distill
            // We pass the entropy score back, though server could recalculate.
            const result = await distillData(currentFileContent, analysis.entropy_score);
            setDistillResult(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setDistilling(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            fontFamily: 'var(--font-sans)',
            transition: 'color 0.3s ease'
        }}>
            <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        <span style={{ color: 'var(--color-accent-cyan)' }}>Dissolution</span> Engine
                    </h1>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>
                        SEMANTIC GARBAGE COLLECTION SYSTEM
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--border-secondary)', border: '1px solid var(--border-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        V 1.0.0 // BETA
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main>
                <FileUpload onFileSelect={handleFileSelect} />

                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-accent-cyan)' }}>
                        ANALYZING SHANNON ENTROPY...
                    </div>
                )}

                {error && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        border: '1px solid var(--color-error)',
                        color: 'var(--color-error)',
                        backgroundColor: 'rgba(255, 0, 85, 0.1)',
                        borderRadius: '4px'
                    }}>
                        ERROR: {error}
                    </div>
                )}

                <AnalysisDashboard
                    analysis={analysis}
                    onDistill={handleDistill}
                    isDistilling={distilling}
                    distillResult={distillResult}
                />
            </main>

            <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#444', fontSize: '0.8rem' }}>
                ANTIGRAVITY SYSTEMS // SECURE VECTOR LEDGER INTEGRATED
            </footer>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
