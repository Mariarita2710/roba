import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVehicleNotes } from "../services/api";
import NotesForm from "../components/NotesForm";

import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Alert,
    Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotesTable from "../components/NotesTable.tsx";

const NotesPage: React.FC = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const navigate = useNavigate();
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
        <Box m={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <IconButton onClick={() => navigate("/fleet")}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">
                    Notes for Vehicle #{vehicleId}
                </Typography>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {notes.length === 0 ? (
                <Alert
                    severity="info"
                    action={
                        <Button color="inherit" size="small" onClick={handleAdd}>
                            Add
                        </Button>
                    }
                >
                    No notes found for this vehicle.
                </Alert>
            ) : (
                <>
                    <NotesTable
                        vehicleId={parseInt(vehicleId!)}
                        notes={notes}
                        onEdit={handleEdit}
                        onNotesUpdated={loadNotes}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button variant="contained" onClick={handleAdd}>
                            Add Note
                        </Button>
                    </Box>
                </>
            )}

            <Dialog open={showForm} onClose={handleFormClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingNote ? "Edit Note" : "Add Note"}
                    <IconButton
                        aria-label="close"
                        onClick={handleFormClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <NotesForm
                        vehicleId={parseInt(vehicleId!)}
                        initialData={editingNote || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default NotesPage;
