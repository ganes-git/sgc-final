import React, { useState } from 'react';
import { searchVectors } from '../api/client';
import caseStudy from '../data/case_study.json';

const AnalysisDashboard = ({ analysis, onDistill, isDistilling, distillResult }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    if (!analysis) return null;

    const { entropy_score, is_dark_data, message } = analysis;

    // Gauge style logic
    const percentage = Math.min(Math.max((entropy_score / 8) * 100, 0), 100);
    const gaugeColor = is_dark_data ? 'var(--color-error)' : 'var(--color-success)';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const data = await searchVectors(searchQuery);
            setSearchResults(data.results);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div style={{
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // Initial layout, we might need 3 columns now
            gap: '1.5rem'
        }}>
            {/* Case Study: Success Story */}
            <div style={{
                gridColumn: '1 / -1',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
                border: '1px solid var(--color-accent-cyan)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
            }}>
                <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-accent-cyan)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {caseStudy.title}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                        File: {caseStudy.original_file} <br />
                        Entropy: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{caseStudy.entropy_score}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>REDUCTION RATIO</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                        {caseStudy.reduction_ratio}
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginLeft: '2rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>VECTOR LEDGER</div>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-cyan)' }}>
                        {caseStudy.vector_ledger_tx.substring(0, 10)}...{caseStudy.vector_ledger_tx.substring(caseStudy.vector_ledger_tx.length - 4)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666' }}>
                        {new Date(caseStudy.timestamp).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Column 1: Analysis & Dissolution */}
            <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg-panel)',
                borderRadius: '8px',
                border: `1px solid ${is_dark_data ? 'var(--color-error)' : 'var(--color-border)'}`
            }}>
                <h2 style={{ margin: '0 0 1rem 0' }}>Analysis Results</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Shannon Entropy Signature</div>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-mono)', color: gaugeColor }}>
                        {entropy_score.toFixed(4)}
                    </div>

                    <div style={{
                        height: '10px',
                        width: '100%',
                        background: '#333',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        marginTop: '0.5rem'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            background: gaugeColor,
                            transition: 'width 0.5s ease-out'
                        }}></div>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <strong>System Verdict:</strong> {message}
                </div>

                {is_dark_data && !distillResult && (
                    <button
                        onClick={onDistill}
                        disabled={isDistilling}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'transparent',
                            color: 'var(--color-accent-cyan)',
                            border: '1px solid var(--color-accent-cyan)',
                            borderRadius: '4px',
                            cursor: isDistilling ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        {isDistilling ? 'Distilling...' : 'INITIATE SEMANTIC DISTILLATION'}
                    </button>
                )}

                {distillResult && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                        <h3 style={{ color: 'var(--color-accent-cyan)' }}>Dissolution Complete</h3>
                        <pre style={{ overflowX: 'auto', background: '#000', padding: '1rem', borderRadius: '4px', border: '1px solid #333', fontSize: '0.7rem' }}>
                            {JSON.stringify(distillResult, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Column 2 (New): Dissolved Knowledge Ledger */}
            <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg-panel)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h2 style={{ margin: '0 0 1rem 0', color: 'var(--color-accent-cyan)' }}>Dissolved Knowledge Ledger</h2>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
                    Query the "ghost" meanings of deleted files from the immutable vector ledger.
                </div>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Search semantic history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #444',
                            background: '#222',
                            color: '#fff'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#333',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        {isSearching ? '...' : 'Search'}
                    </button>
                </form>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {searchResults ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {searchResults.map(result => (
                                <div key={result.id} style={{
                                    padding: '0.75rem',
                                    background: 'rgba(0, 255, 255, 0.05)',
                                    borderLeft: '2px solid var(--color-accent-cyan)',
                                    borderRadius: '0 4px 4px 0'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                                        {new Date(result.timestamp).toLocaleString()} // Similarity: {(result.similarity * 100).toFixed(1)}%
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>{result.content}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#444', marginTop: '2rem', fontStyle: 'italic' }}>
                            Ledger ready. Enter a query to retrieve dissolved artifacts.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalysisDashboard;
