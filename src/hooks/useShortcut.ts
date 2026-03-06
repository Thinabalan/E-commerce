import { useHotkeys } from "react-hotkeys-hook";

type ShortcutMap = Record<string, () => void>;

export const useShortcuts = (shortcuts: ShortcutMap) => {
  Object.entries(shortcuts).forEach(([keys, cb]) => {
    useHotkeys(keys, (e) => {
      e.preventDefault();
      cb();
    });
  });
};