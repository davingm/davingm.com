"use client";

import { useEffect } from "react";

export function OfflinePresentation({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const updateConnectionState = () => {
      document.documentElement.classList.toggle("is-offline", !navigator.onLine);
    };

    const handleOfflineNavigation = (event: MouseEvent) => {
      if (navigator.onLine || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      window.location.assign(destination.href);
    };

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "offline") {
        document.documentElement.classList.add("is-offline");
      } else if (event.data?.type === "online") {
        document.documentElement.classList.remove("is-offline");
      }
    };

    updateConnectionState();
    window.addEventListener("online", updateConnectionState);
    window.addEventListener("offline", updateConnectionState);
    document.addEventListener("click", handleOfflineNavigation, true);
    navigator.serviceWorker?.addEventListener("message", handleServiceWorkerMessage);

    return () => {
      window.removeEventListener("online", updateConnectionState);
      window.removeEventListener("offline", updateConnectionState);
      document.removeEventListener("click", handleOfflineNavigation, true);
      navigator.serviceWorker?.removeEventListener("message", handleServiceWorkerMessage);
    };
  }, []);

  return (
    <div className="offline-presentation w-full flex-1 flex flex-col">
      <div className="offline-online-content w-full flex-1 flex flex-col">
        {children}
      </div>
      <div className="offline-image" aria-label="You are offline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/off.gif" alt="Offline" />
      </div>
    </div>
  );
}
