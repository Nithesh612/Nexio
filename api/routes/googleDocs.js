const crypto = require("crypto");

const SCOPES = ["https://www.googleapis.com/auth/documents"];
const TOKEN_URL = "https://oauth2.googleapis.com/token";

let cachedToken = null;

function base64Url(value) {
    return Buffer.from(value)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function getCredentials() {
    if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error("GOOGLE_CREDENTIALS is missing in api/.env");
    }

    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    if (!credentials.client_email || !credentials.private_key) {
        throw new Error("GOOGLE_CREDENTIALS must include client_email and private_key");
    }

    return credentials;
}

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && cachedToken.expiresAt - 60 > now) {
        return cachedToken.accessToken;
    }

    const credentials = getCredentials();
    const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claims = base64Url(JSON.stringify({
        iss: credentials.client_email,
        scope: SCOPES.join(" "),
        aud: TOKEN_URL,
        exp: now + 3600,
        iat: now,
    }));
    const unsignedJwt = `${header}.${claims}`;
    const signature = crypto
        .createSign("RSA-SHA256")
        .update(unsignedJwt)
        .sign(credentials.private_key, "base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: `${unsignedJwt}.${signature}`,
        }),
    });

    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.error_description || body.error || "Failed to get Google access token");
    }

    cachedToken = {
        accessToken: body.access_token,
        expiresAt: now + Number(body.expires_in || 3600),
    };

    return cachedToken.accessToken;
}

function ensureProtocol(url) {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

async function saveLinkToGoogleDoc({ title, url, category, description }) {
    const documentId = process.env.DOCUMENT_ID;
    if (!documentId || documentId === "YOUR_DOC_ID_HERE") {
        throw new Error("DOCUMENT_ID is missing in api/.env");
    }

    const finalUrl = ensureProtocol(url.trim());
    const token = await getAccessToken();
    const savedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const text = [
        "----------------------------------------",
        `Category: ${category || "General"}`,
        `Title: ${title}`,
        `URL: ${finalUrl}`,
        description ? `Description: ${description}` : "",
        `Saved: ${savedAt}`,
        "",
        "",
    ].filter(Boolean).join("\n");

    const urlStartIndex = 1 + text.indexOf(finalUrl);
    const urlEndIndex = urlStartIndex + finalUrl.length;

    const response = await fetch(
        `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requests: [
                    {
                        insertText: {
                            location: { index: 1 },
                            text,
                        },
                    },
                    {
                        updateTextStyle: {
                            range: {
                                startIndex: urlStartIndex,
                                endIndex: urlEndIndex,
                            },
                            textStyle: {
                                link: { url: finalUrl },
                                foregroundColor: {
                                    color: { rgbColor: { blue: 1 } },
                                },
                                underline: true,
                            },
                            fields: "link,foregroundColor,underline",
                        },
                    },
                ],
            }),
        },
    );

    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.error?.message || "Failed to save link to Google Docs");
    }

    return { documentId, url: finalUrl };
}

module.exports = {
    ensureProtocol,
    saveLinkToGoogleDoc,
};
