import { bodyToParams, escapeXml } from "./helpers/format.js";

export default async function handler(req, res) {
  const params = await bodyToParams(req);
  const inputType = params.InputType || params.inputType || "";
  const name = inputType === "speech" ? params.Speech : "";
  const conf = Number(params.SpeechConfidenceScore || "0");
  const base = new URL(req.url, `https://${req.headers.host}`);

  if (!name || conf < 0.6) {
    const retry =
`<Response>
  <GetInput action="${base.origin}/api/collect-name" method="POST" inputType="dtmf speech" speechModel="phone_call" language="en-IN">
    <Speak language="en-IN" voice="Polly.Aditi">Sorry, I missed that. Please say your name slowly. Or press 9 to enter it with the keypad.</Speak>
  </GetInput>
</Response>`;
    res.setHeader("content-type", "text/xml; charset=utf-8");
    return res.status(200).send(retry);
  }

  const next = `${base.origin}/api/collect-service?name=${encodeURIComponent(name)}&conf=${conf}`;
  const out =
`<Response>
  <GetInput action="${next}" method="POST" inputType="dtmf speech" speechModel="phone_call" language="en-IN">
    <Speak language="en-IN" voice="Polly.Aditi">Thanks ${escapeXml(name)}. What service do you want. You can say order tea, order coffee, wholesale, or support. You can also say something else.</Speak>
  </GetInput>
</Response>`;
  res.setHeader("content-type", "text/xml; charset=utf-8");
  res.status(200).send(out);
}
