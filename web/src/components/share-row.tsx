"use client";

import { useState } from "react";

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The visitor closed the share sheet. Fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="share-row">
      <button type="button" className="btn btn--sm btn--ghost" onClick={share}>
        {copied ? "Link copied" : "Share this page"}
      </button>
    </div>
  );
}
