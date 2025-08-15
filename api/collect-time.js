import { bodyToParams, parseToIST, speakableIST, escapeXml } from "./helpers/format.js";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export default async function handler(req, res) {
  const params = await bodyToParams(req);
  const proto = req.headers["x-forwarded-proto"] || "https";
const base = new URL(req.url, `${proto}://${req.headers.host}`);
  const name = url.searchParams.get("name") || "caller";
  const service = url.searchParams.get("service") || "service";
  const inputType = params.InputType || "";
  const spoken = inputType === "speech" ? params.Speech : "";
  const conf = Number(params.SpeechConfidenceScore || "0");

  const ist = parseToIST(spoken);
  if (!ist) {
    const retry =
`<Response>
  <GetInput action="${url.origin}/api/collect-time?name=${encodeURIComponent(name)}&service=${encodeURIComponent(service)}" method="POST" inputType="dtmf speech" speechModel="phone_call" language="en-IN">
    <Speak language="en-IN" voice="Polly.Aditi">Sorry, I did not catch the time. Please say the date and time again, like Monday at five in the evening.</Speak>
  </GetInput>
</Response>`;
    res.setHeader("content-type", "text/xml; charset=utf-8");
    return res.status(200).send(retry);
  }

  try {
    if (APPS_SCRIPT_URL) {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          from: params.From || "",
          name,
          service,
          preferred_time_ist: ist.toISOString(),
          confidence: conf,
          raw: { query: spoken, params }
        })
      });
    }
  } catch {}

  const niceTime = speakableIST(ist);
  const summary =
`<Response>
  <Speak language="en-IN" voice="Polly.Aditi">Thanks ${escapeXml(name)}. I noted ${escapeXml(service)} at ${escapeXml(niceTime)} India time. We will confirm by message. Goodbye.</Speak>
</Response>`;
  res.setHeader("content-type", "text/xml; charset=utf-8");
  res.status(200).send(summary);
}
