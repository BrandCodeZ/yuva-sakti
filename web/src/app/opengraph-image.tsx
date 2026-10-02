import { ImageResponse } from "next/og";
import { eventConfig } from "@/config/event";
import { eventWhenAndWhere } from "@/lib/event-state";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${eventConfig.name} — ${eventConfig.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161816",
          color: "#FAF7F2",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 56, background: "#F47B20" }} />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#A5ABA5",
            }}
          >
            Delhi, India
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 116,
              lineHeight: 0.95,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: -1,
            }}
          >
            {eventConfig.name}
          </div>
          <div style={{ fontSize: 46, color: "#F47B20", marginTop: 12 }}>
            {eventConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "4px solid #138808",
            paddingTop: 28,
            fontSize: 30,
          }}
        >
          <div>{eventWhenAndWhere()}</div>
          <div style={{ display: "flex", gap: 16, color: "#A5ABA5", fontSize: 26 }}>
            {eventConfig.races.map((race) => (
              <span key={race.id}>{race.name}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
