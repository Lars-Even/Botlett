/*
Vi sjekker at sha256 signaturen til GITHUB_SECRET er like den sent av GitHub,
hvis vi ikke har spesifisert lokal GITHUB_SECRET returnerer den bare "True" ".

Skrevet av Lars-Even
*/

import { createHmac, timingSafeEqual } from "node:crypto";

const GITHUB_SECRET = Bun.env.GITHUB_SECRET || "";

export async function verifySignature(
    req: Request,
    bodyText: string,
): Promise<boolean> {
    if (!GITHUB_SECRET) return true;

    const signature = req.headers.get("x-hub-signature-256");
    if (!signature) return false;

    const hmac = createHmac("sha256", GITHUB_SECRET);
    hmac.update(bodyText);
    const digest = `sha256=${hmac.digest("hex")}`;

    return (
        signature.length === digest.length &&
        timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
    );
}
