import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVehicleNotes, deleteNote } from "../services/api";
import NotesForm from "../components/NotesForm";

const NotesPage: React.FC = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const [notes, setNotes] = useState<any[]>([]);
    const [editingNote, setEditingNote] = useState<any | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotes = async () => {
        if (!vehicleId) return;
        try {
            const data = await fetchVehicleNotes(parseInt(vehicleId), 0, 1000);
            setNotes(data.content || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    useEffect(() => {
        loadNotes();
    }, [vehicleId]);

    const handleDelete = async (noteId: number) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await deleteNote(parseInt(vehicleId!), noteId);
            await loadNotes();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete note");
        }
    };

    const handleAdd = () => {
        setEditingNote(null);
        setShowForm(true);
    };

    const handleEdit = (note: any) => {
        setEditingNote(note);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setEditingNote(null);
        setShowForm(false);
    };

    const handleFormSubmit = async () => {
        await loadNotes();
        handleFormClose();
    };

    return (
        <div className="container mt-4">
            <h1>Notes for Vehicle #{vehicleId}</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {showForm ? (
                <NotesForm
                    vehicleId={parseInt(vehicleId!)}
                    initialData={editingNote || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormClose}
                />
            ) : (
                <>
                    {notes.length === 0 ? (
                        <div className="alert alert-info">
                            No notes found for this vehicle.
                            <button className="btn btn-primary ms-3" onClick={handleAdd}>Add New Note</button>
                        </div>
                    ) : (
                        <>
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Author</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {notes.map((note) => (
                                    <tr key={note.id}>
                                        <td>{note.note}</td>
                                        <td>{note.author}</td>
                                        <td>{new Date(note.createdAt).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(note)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(note.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <button className="btn btn-primary mt-3" onClick={handleAdd}>Add New Note</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default NotesPage;
