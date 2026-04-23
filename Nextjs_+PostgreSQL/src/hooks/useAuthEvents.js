
import { useEffect } from "react";
import { authEvents } from "@/lib/authEvents";

export function useAuthEvent(event, handler) {
  useEffect(() => {
    return authEvents.on(event, handler);
  }, [event, handler]);
}