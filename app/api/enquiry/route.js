// Enquiry endpoint for the cast-film page.
//
// The client asked that enquiries be routed privately to hadley@shinho-global.com and that the address is
// NOT shown anywhere on the public pages. That rules out the old mailto: approach, which puts the address
// in the page source — so submissions come here instead.
//
// NOT FINISHED: this handler validates and accepts the enquiry, but nothing delivers it yet. Before launch,
// wire the send below to a transactional email service (Resend / SendGrid / SES) or the client's CRM, with
// the destination address in an environment variable — never hard-coded in a client component.
//   const to = process.env.ENQUIRY_TO;   // hadley@shinho-global.com until another inbox has been tested
// Form delivery must then be tested on desktop and phone, per the client's pre-launch list.

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(data.name || "").trim();
  const company = String(data.company || "").trim();
  const email = String(data.email || "").trim();
  const request_ = String(data.request || "").trim();

  if (!name || !company || !email || !request_) {
    return Response.json({ ok: false, error: "Please fill in name, company, business email and your request." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(email)) {
    return Response.json({ ok: false, error: "Please check the email address." }, { status: 400 });
  }

  // TODO: deliver the enquiry. Until then it is accepted and dropped, so the page can be reviewed end to end.
  console.info("[enquiry] cast films", { name, company, email, films: data.films, quantity: data.quantity });

  return Response.json({ ok: true });
}
