// Where to get access for each carrier. Portal pages change: verify on the linked site. Only Delhivery and 17TRACK have direct adapters today.
export type CatalogItem = { code: string; name: string; direct: boolean; docs: string; steps: string };
export const CATALOG: CatalogItem[] = [
  { code: "delhivery", name: "Delhivery", direct: true, docs: "https://one.delhivery.com/developer-portal", steps: "Needs a Delhivery business (client) account. Open the Developer Portal / API settings and copy your API token. If you can't see it, ask your Delhivery account manager to enable API access." },
  { code: "track17", name: "17TRACK", direct: true, docs: "https://api.17track.net/en", steps: "Create an account on 17track.net, open the API console, and copy your API key (a free quota is included). One key covers DHL, Blue Dart, DTDC, India Post, FedEx, UPS and 2,000+ carriers." },
  { code: "dhl", name: "DHL", direct: true, docs: "https://developer.dhl.com", steps: "Register at developer.dhl.com, create an app subscribed to the Shipment Tracking API and copy its API key and paste it above." },
  { code: "bluedart", name: "Blue Dart", direct: false, docs: "https://www.bluedart.com", steps: "Needs a Blue Dart business account. Ask your account manager for tracking API access (login ID and license key). Works through 17TRACK meanwhile." },
  { code: "dtdc", name: "DTDC", direct: false, docs: "https://www.dtdc.in", steps: "Needs a DTDC customer account. Request tracking API access from your DTDC account manager. Works through 17TRACK meanwhile." },
  { code: "indiapost", name: "India Post", direct: false, docs: "https://www.indiapost.gov.in", steps: "India Post has no open tracking API for third parties. Use 17TRACK." },
  { code: "fedex", name: "FedEx", direct: true, docs: "https://developer.fedex.com", steps: "Create a FedEx Developer account, create a project that includes the Track API, and copy the API key and secret, then save them here as KEY:SECRET (a colon between)." },
  { code: "ups", name: "UPS", direct: true, docs: "https://developer.ups.com", steps: "Create an app in the UPS Developer Portal with the Tracking API, then save them here as CLIENT_ID:CLIENT_SECRET (a colon between)." },
];
