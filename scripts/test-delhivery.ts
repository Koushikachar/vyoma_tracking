// Usage: npm run test:delhivery -- <waybill>
async function main() {
  const key = process.env.DELHIVERY_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const id = process.argv[2];
  if (!key) {
    console.log(
      "X DELHIVERY_API_KEY is empty. Add it to .env (this script does not read keys saved in the Integrations page).",
    );
    process.exit(1);
  }
  if (!id) {
    console.log("Usage: npm run test:delhivery -- <waybill number>");
    process.exit(1);
  }
  console.log(
    `Key found (${key.length} characters, starts with "${key.slice(0, 4)}...")`,
  );
  const res = await fetch(
    `https://track.delhivery.com/api/v1/packages/json/?waybill=${encodeURIComponent(id)}`,
    { headers: { Authorization: `Token ${key}` } },
  ).catch((e: Error) => {
    console.log(
      "X Network error:",
      e.message,
      "\n  Your internet, VPN or firewall may be blocking track.delhivery.com.",
    );
    return process.exit(1) as never;
  });
  const text = await res.text();
  console.log(`HTTP ${res.status}`);
  console.log("Response starts with:", text.slice(0, 300).replace(/\s+/g, " "));
  if (res.status === 401)
    console.log(
      "\nX Delhivery rejected the token (401). It is wrong, was regenerated, or has extra characters. Copy it again from Delhivery One > Settings > API and MCP Setup.",
    );
  else if (res.status === 403)
    console.log(
      "\nX Delhivery refused access (403). The token is not allowed to use the tracking API. Ask your Delhivery account manager to enable it.",
    );
  else if (res.status === 429)
    console.log("\n! Too many requests. Wait a minute and retry.");
  else if (!res.ok)
    console.log("\nX Unexpected Delhivery error. Send me the lines above.");
  else {
    let j: any = null;
    try {
      j = JSON.parse(text);
    } catch {}
    const sh = j?.ShipmentData?.[0]?.Shipment;
    if (sh)
      console.log(
        `\nOK Token works. Status: ${sh.Status?.Status ?? "?"}, ${sh.Scans?.length ?? 0} scan events.`,
      );
    else
      console.log(
        "\n! Token was accepted, but this waybill returned no shipment. Check the number, and try one created from your own Delhivery account.",
      );
  }
}
main();
