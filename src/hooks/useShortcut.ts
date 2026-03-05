import { useEffect, useCallback } from "react";

type ShortcutOptions = {
    preventDefault?: boolean;
};

function parseShortcut(shortcut: string) {
    const keys = shortcut.toLowerCase().split("+");

    let key = keys[keys.length - 1];

    // normalize escape
    if (key === "esc") key = "escape";

    return {
        key,
        ctrlKey: keys.includes("ctrl"),
        altKey: keys.includes("alt"),
        shiftKey: keys.includes("shift"),
        metaKey: keys.includes("meta"),
    };
}

export const useShortcut = (
    shortcut: string,
    callback: () => void,
    options: ShortcutOptions = { preventDefault: true }
) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            const isTypingElement =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable;

            // Ignore normal typing but allow ctrl/alt/meta shortcuts
            if (isTypingElement && !event.ctrlKey && !event.metaKey && !event.altKey) {
                return;
            }

            const parsed = parseShortcut(shortcut);

            const isMatch =
                event.key.toLowerCase() === parsed.key &&
                event.ctrlKey === parsed.ctrlKey &&
                event.altKey === parsed.altKey &&
                event.shiftKey === parsed.shiftKey &&
                event.metaKey === parsed.metaKey;

            if (isMatch) {
                if (options.preventDefault) {
                    event.preventDefault();
                }
                callback();
            }
        },
        [shortcut, callback, options.preventDefault]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);
};