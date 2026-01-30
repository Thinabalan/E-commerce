import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "./useRegistration";
import { useSnackbar } from "../../context/SnackbarContext";

export const useRegistrationHandlers = () => {
    const registration = useRegistration();
    const { deleteRegistration } = registration;
    const { showSnackbar } = useSnackbar();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteRegistration(deleteId);
            showSnackbar("Registration deleted successfully", "success");
            setDeleteId(null);
        } catch (error) {
            showSnackbar("Failed to delete registration", "error");
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return {
        ...registration,
        deleteId,
        setDeleteId,
        handleDelete,
        handleBack,
    };
};
