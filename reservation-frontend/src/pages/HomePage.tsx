import { Box, Typography, Container } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const HomePage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            height="100vh"
            sx={{ p: 4 }}
        >
            <Container
                maxWidth="md"
                sx={{
                    textAlign: "center",
                    bgcolor: "white",
                    p: 6,
                    borderRadius: 4,
                    boxShadow: 4,
                }}
            >
                <DirectionsCarIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome to the Car Rental System
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Use the navigation bar to manage car models, vehicles, maintenance records and more.
                </Typography>
            </Container>
        </Box>
    );
};

export default HomePage;
