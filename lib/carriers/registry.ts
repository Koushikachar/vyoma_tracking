import { CarrierAdapter } from "./types";
import { vyomaTest } from "./vyoma-test";
import { delhivery } from "./delhivery";
import { track17 } from "./track17";
import { dhl } from "./dhl";
import { fedex } from "./fedex";
import { ups } from "./ups";
// Add new carriers here: import the adapter and append it. The tracking engine is untouched.
// Delhivery / 17TRACK adapters should only report isConfigured() === true when their env key is set.
const adapters: CarrierAdapter[] = [vyomaTest, delhivery, track17, dhl, fedex, ups];
export const listAdapters = () => adapters;
export const getAdapter = (code: string) => adapters.find(a => a.code === code && a.isConfigured());
