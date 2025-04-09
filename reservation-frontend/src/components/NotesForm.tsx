import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Stack
} from "@mui/material";
import { createNote, updateNote } from "../services/api";

export interface NotesFormData {
    note: string;
    author: string;
    createdAt: string;
}

interface Props {
    vehicleId: number;
    initialData?: NotesFormData & { id: number }; // edit mode se presente
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
            setCreatedAt(initialData.createdAt?.slice(0, 16)); // formato per datetime-local
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            author,
            note,
            createdAt: createdAt ? new Date(createdAt).toISOString() : undefined
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
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" gutterBottom>
                {initialData ? "Edit Note" : "Add New Note"}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack spacing={2}>
                <TextField
                    label="Content"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    multiline
                    rows={3}
                    fullWidth
                />

                <TextField
                    label="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Date"
                    type="datetime-local"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button type="submit" variant="contained">
                        Save
                    </Button>
                    {onCancel && (
                        <Button variant="outlined" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default NotesForm;
