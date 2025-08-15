export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] || "https";
const base = new URL(req.url, `${proto}://${req.headers.host}`);
  const next = `${base.origin}/api/collect-name`;
  const response =
`<Response>
  <GetInput action="${next}" method="POST" inputType="dtmf speech" speechModel="phone_call" language="en-IN" speechEndTimeout="auto" digitEndTimeout="auto" log="true">
    <Speak language="en-IN" voice="Polly.Aditi">Hello. Thanks for calling Hillblend. May I have your name.</Speak>
  </GetInput>
  <Speak language="en-IN" voice="Polly.Aditi">I did not hear anything. Goodbye.</Speak>
</Response>`;
  res.setHeader("content-type", "text/xml; charset=utf-8");
  res.status(200).send(response);
}
