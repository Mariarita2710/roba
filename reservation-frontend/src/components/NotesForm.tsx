import React, { useState, useEffect } from "react";
import { createNote, updateNote } from "../services/api";

export interface NotesFormData {
    note: string;
    author: string;
    createdAt: string;
}

interface Props {
    vehicleId: number;
    initialData?: NotesFormData & { id: number }; // se presente => edit mode
    onSubmit?: () => void;
    onCancel?: () => void;
}

const NotesForm: React.FC<Props> = ({ vehicleId, initialData, onSubmit, onCancel }) => {

    const [note, setNote] = useState("");
    const [author, setAuthor] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setNote(initialData.note);
            setAuthor(initialData.author);
            setCreatedAt(initialData.createdAt);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            author,
            note,
            ...(createdAt && { createdAt: new Date(createdAt).toISOString() })
        };

        try {
            if (initialData) {
                await updateNote(vehicleId, initialData.id, payload);
            } else {
                await createNote(vehicleId, payload);
            }
            onSubmit?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save note");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h3>{initialData ? "Edit Note" : "Add New Note"}</h3>

            {error && <div className="alert alert-danger">{error}</div>}


            <div className="mb-2">
                <label className="form-label">Content</label>
                <textarea
                    className="form-control"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Author</label>
                <input
                    type="text"
                    className="form-control"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Date</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary me-2">Save</button>
            {onCancel && (
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default NotesForm;
