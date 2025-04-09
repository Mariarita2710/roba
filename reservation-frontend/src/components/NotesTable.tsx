import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Stack,
    Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteNote, Note } from "../services/api";

type Props = {
    vehicleId: number;
    notes: Note[];
    onEdit: (note: Note) => void;
    onNotesUpdated: () => void;
};

const NotesTable: React.FC<Props> = ({ vehicleId, notes, onEdit, onNotesUpdated }) => {
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (noteId: number) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await deleteNote(vehicleId, noteId);
            onNotesUpdated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete note");
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Notes History
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Content</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No notes available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            notes.map((note) => (
                                <TableRow key={note.id}>
                                    <TableCell>{note.note}</TableCell>
                                    <TableCell>{note.author}</TableCell>
                                    <TableCell>{new Date(note.createdAt).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton color="primary" onClick={() => onEdit(note)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(note.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default NotesTable;
