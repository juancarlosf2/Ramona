import { useEffect, useCallback } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

type Options = {
  enabled?: boolean;
};

export function useHotkeys(
  keys: string,
  callback: KeyHandler,
  options: Options = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const hotkeys = keys.toLowerCase();
      const key = event.key.toLowerCase();

      // Check for modifier keys
      const hasCtrl = hotkeys.includes("ctrl") || hotkeys.includes("control");
      const hasShift = hotkeys.includes("shift");
      const hasAlt = hotkeys.includes("alt");
      const hasMeta =
        hotkeys.includes("meta") ||
        hotkeys.includes("cmd") ||
        hotkeys.includes("command");
      const hasModifier = hotkeys.includes("mod");

      // Check if modifiers match
      const ctrlMatch = hasCtrl === event.ctrlKey;
      const shiftMatch = hasShift === event.shiftKey;
      const altMatch = hasAlt === event.altKey;
      const metaMatch = hasMeta === event.metaKey;
      const modMatch = hasModifier ? event.ctrlKey || event.metaKey : true;

      // Extract the actual key (last part of the hotkey)
      const keyParts = hotkeys.split("+");
      const targetKey = keyParts[keyParts.length - 1].trim();

      // Check if the key matches
      const keyMatch = targetKey === key;

      if (
        ctrlMatch &&
        shiftMatch &&
        altMatch &&
        metaMatch &&
        modMatch &&
        keyMatch
      ) {
        callback(event);
      }
    },
    [callback, keys, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}
