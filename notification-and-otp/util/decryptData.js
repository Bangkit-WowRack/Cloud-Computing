import crypto from "crypto";
export const decryptAuthData = (encryptedUserAuthData) => {
    const parts = encryptedUserAuthData.split(":");
    const iv = Buffer.from(parts[0], "base64");
    const encryptedData = parts[1];

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(process.env.SECRET_KEY, "base64"),
        iv,
    );
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf-8");

    return JSON.parse(decrypted);
};
