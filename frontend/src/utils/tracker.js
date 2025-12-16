// src/utils/tracker.js

// create or reuse a session ID
function getSessionId() {
  try {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        crypto?.randomUUID?.() || Math.random().toString(36).substring(2);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  } catch {
    return "fallback-session";
  }
}

// detect device type
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

// extract UTM params
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// main tracking function
export function trackEvent(event, payload = {}) {
  try {
    if (!event) return;

    fetch("http://127.0.0.1:8000/api/track-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        event,
        payload: payload || {},
        metadata: {
          device: getDeviceType(),
          referrer: document.referrer || null,
          utm_source: getParam("utm_source"),
          utm_medium: getParam("utm_medium"),
          utm_campaign: getParam("utm_campaign"),
          user_agent: navigator.userAgent || null,
        },
      }),
    }).catch(() => {
      // swallow network errors — tracking must never break UI
    });
  } catch (e) {
    // swallow all JS errors
  }
}
