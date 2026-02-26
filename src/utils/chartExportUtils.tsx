import * as htmlToImage from "html-to-image";

export const downloadAsPNG = async (ref: React.RefObject<HTMLElement | null>, filename: string) => {
    if (!ref.current) return;
    try {
        const dataUrl = await htmlToImage.toPng(ref.current, { backgroundColor: "#ffffff" });
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error("Failed to export as PNG:", error);
    }
};

export const downloadAsSVG = async (ref: React.RefObject<HTMLElement | null>, filename: string) => {
    if (!ref.current) return;
    try {
        const dataUrl = await htmlToImage.toSvg(ref.current, { backgroundColor: "#ffffff" });
        const link = document.createElement("a");
        link.download = `${filename}.svg`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error("Failed to export as SVG:", error);
    }
};
