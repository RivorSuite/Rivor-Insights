import React, { useState, useEffect } from 'react';
import { textContent } from './Content'; 
import './TextPage.css';

// A new component to render different content types
const ContentRenderer = ({ item }) => {
    switch (item.type) {
        case 'h2':
            return <h2 className="article-h2">{item.text}</h2>;
        case 'p':
            return <p dangerouslySetInnerHTML={{ __html: item.text }} />;
        case 'li':
            return <li dangerouslySetInnerHTML={{ __html: item.text }} />;
        case 'code':
            return <pre className="article-code"><code>{item.text}</code></pre>;
        default:
            return null;
    }
};

function TextPage({ onBack }) {
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const articlesByCategory = Object.entries(textContent).reduce((acc, [id, article]) => {
        const { category } = article;
        if (!acc[category]) {acc[category] = [];}
        acc[category].push({ id, ...article });
        return acc;
    }, {});

    if (selectedArticleId) {
        const article = textContent[selectedArticleId];
        return (
            <div className="text-page-container">
                <div className="text-page-header">
                    <h1 className="auth-title">{article.title}</h1>
                    <button onClick={() => setSelectedArticleId(null)} className="auth-button" style={{ maxWidth: '200px' }}>Back to Articles</button>
                </div>
                <div className="text-page-content">
                    {article.content.map((item, index) => (
                        <ContentRenderer key={index} item={item} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="text-page-container">
            <div className="text-page-header">
                <h1 className="auth-title">Articles & Concepts</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back</button>
            </div>
            
            {Object.entries(articlesByCategory).map(([category, articles]) => (
                <div key={category} className="article-category-section">
                    <h2 className="article-category-title">{category}</h2>
                    <div className="article-list">
                        {articles.map(article => (
                            <div key={article.id} className="article-list-item" onClick={() => setSelectedArticleId(article.id)}>
                                <h3>{article.title}</h3>
                                <span>Read More ›</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
export default TextPage;