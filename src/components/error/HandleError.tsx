export type HandleErrorParams = {
    error: any;
    showBoundary?: (error: Error) => void;
    showSnackbar?: (msg: string, severity: "error") => void;
    fallbackMessage: string;
};

export const handleError = ({
    error,
    showBoundary,
    showSnackbar,
    fallbackMessage,
}: HandleErrorParams) => {
    //  SERVER DOWN / NETWORK ERROR - FULL PAGE
    if (error?.isServerDown && showBoundary) {
        const finalError = new Error(fallbackMessage);
        showBoundary(finalError);
        throw finalError;
    }

    //  API / DOMAIN ERROR - THROW (snackbar handled by caller)
    const message = error?.customMessage || fallbackMessage;

    if (showSnackbar) {
        showSnackbar(message, "error");
    } else {
        throw new Error(message);
    }
};
