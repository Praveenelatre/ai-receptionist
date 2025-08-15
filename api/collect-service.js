import { bodyToParams } from "./helpers/format.js";

const normalize = s => String(s || "").toLowerCase();

export default async function handler(req, res) {
  const params = await bodyToParams(req);
  const query = Object.fromEntries(new URL(req.url, `http://${req.headers.host}`).searchParams);
  const name = query.name || "caller";
  const nameConf = Number(query.conf || "0");
  const inputType = params.InputType || "";
  const spoken = inputType === "speech" ? params.Speech : "";
  let service = normalize(spoken);

  if (/wholesale|bulk/.test(service)) service = "wholesale";
  else if (/support|help/.test(service)) service = "support";
  else if (/order.*tea/.test(service)) service = "order tea";
  else if (/order.*coffee/.test(service)) service = "order coffee";
  else if (/order/.test(service)) service = "order";
  else service = spoken || params.Digits || "";

  const base = new URL(req.url, `https://${req.headers.host}`);
  const next = `${base.origin}/api/collect-time?name=${encodeURIComponent(name)}&service=${encodeURIComponent(service)}&conf=${nameConf}`;

  const out =
`<Response>
  <GetInput action="${next}" method="POST" inputType="dtmf speech" speechModel="phone_call" language="en-IN">
    <Speak language="en-IN" voice="Polly.Aditi">Got it. When should we schedule. You can say tomorrow at ten in the morning, or say a date and time.</Speak>
  </GetInput>
</Response>`;
  res.setHeader("content-type", "text/xml; charset=utf-8");
  res.status(200).send(out);
}
