import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WorkflowView: React.FC = () => {
    const { t } = useTranslation();
    const [markdownContent, setMarkdownContent] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkflow = async () => {
            try {
                const response = await fetch('/workflow.md');
                if (!response.ok) {
                    throw new Error(t('error.workflowLoad'));
                }
                const text = await response.text();
                setMarkdownContent(text);
                setEditedContent(text);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(t('error.workflowLoad'));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkflow();
    }, [t]);

    const handleEdit = () => {
        setEditedContent(markdownContent);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };
    
    const handleSave = () => {
        setMarkdownContent(editedContent);
        setIsEditing(false);
        // In a real app, this would be a POST/PUT request to a backend.
        // Here we just update the state to simulate saving.
    };


    if (isLoading) {
        return <div className="text-center p-8">{t('loader.loading')}</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">{t('workflow.title')}</h2>
                {!isEditing && (
                    <button onClick={handleEdit} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700">
                        {t('app.buttons.edit')}
                    </button>
                )}
            </div>

            {isEditing ? (
                <div>
                     <p className="p-3 mb-4 text-sm text-center text-blue-800 bg-blue-100 border border-blue-200 rounded-lg">{t('workflow.edit_notice')}</p>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-96 p-3 font-mono text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end gap-4 mt-4">
                         <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">
                            {t('app.buttons.cancel')}
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700">
                           {t('app.buttons.save')}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="mb-6 text-slate-600">{t('workflow.description')}</p>
                    <div 
                        className="p-4 prose prose-slate max-w-none bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap font-mono text-sm"
                    >
                        {markdownContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkflowView;
