import crypto from "crypto";
export const encryptAuthData = (user_login_payload) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(process.env.SECRET_KEY, "base64"),
        iv,
    );
    let encryptedUserAuthData = cipher.update(
        JSON.stringify(user_login_payload),
        "utf-8",
        "base64",
    );
    encryptedUserAuthData += cipher.final("base64");
    encryptedUserAuthData = iv.toString("base64") + ":" + encryptedUserAuthData;
    return encryptedUserAuthData;
};
