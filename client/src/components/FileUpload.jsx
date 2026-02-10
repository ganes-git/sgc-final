import React, { useRef, useState } from 'react';

const FileUpload = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setError('');
        const file = e.target.files[0];

        if (!file) return;

        // 1GB Size Limit (1024 * 1024 * 1024 bytes)
        const MAX_SIZE = 1024 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setError(`File too big (${(file.size / 1024 / 1024).toFixed(2)} MB). Max limit is 1GB.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            // For this demo, we assume the backend handles raw string content for analysis
            // In production, might send formData or base64.
            onFileSelect({ name: file.name, content: content });
        };

        // Simple handling: Read as text for CSV/TXT/Code. 
        // For PDF/IMG, we'd need more complex parsing or base64.
        // Reading as string specifically for the text-based entropy logic.
        reader.readAsText(file);
    };

    return (
        <div style={{
            border: '2px dashed var(--border-primary)',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-secondary)',
            cursor: 'pointer',
            transition: 'border-color 0.3s'
        }}
            onClick={() => fileInputRef.current.click()}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-cyan)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".txt,.csv,.pdf,.png,.jpg,.jpeg,.md,.json"
            />

            <div style={{ color: 'var(--color-accent-cyan)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                drag & drop or click to upload
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Supports PDF, Text, Images, CSV (Max 1GB)
            </div>

            {error && (
                <div style={{ color: 'var(--color-error)', marginTop: '1rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
