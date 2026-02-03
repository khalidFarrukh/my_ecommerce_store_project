import { useEffect } from "react";

export default function useOnClickOutside(parentRef, childRef, handler, isActive = true) {
    useEffect(() => {
        if (!isActive) return;
        const listener = (event) => {

            // If click is inside ref element, do nothing
            if (!parentRef.current || parentRef.current.contains(event.target)
                || !childRef.current || childRef.current.contains(event.target)) {
                return;
            }
            handler(event); // Otherwise, call the handler
            console.log("outside");
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [parentRef, childRef, handler]);
}