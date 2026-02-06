import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "./useRegistration";
import { useUI } from "../../context/UIContext";

export const useRegistrationHandlers = () => {
    const registration = useRegistration();
    const { deleteRegistration } = registration;
    const { showSnackbar } = useUI();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteRegistration(deleteId);
            showSnackbar("Registration deleted successfully", "success");
            setDeleteId(null);
        } catch (error: any) {
            showSnackbar(error.message, "error");
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const handlePreview = (row: any) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewData(row);
    };

    const handleEdit = (row: any) => (e: React.MouseEvent) => {
        e.stopPropagation();
        const {
            sellerName,
            sellerEmail,
            warehouseNames,
            businessNames,
            ...originalData
        } = row;
        navigate(`/form/${row.id}`, { state: { registrationData: originalData } });
    };

    const handleDeleteClick = (id: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteId(id);
    };

    return {
        ...registration,
        deleteId,
        setDeleteId,
        previewData,
        setPreviewData,
        handleDelete,
        handleBack,
        handlePreview,
        handleEdit,
        handleDeleteClick,
    };
};
