import CryptoJS from "crypto-js";

const SECRET = process.env.AES_SECRET!;

export const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, SECRET).toString();
};

export const decrypt = (cipher: string) => {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};