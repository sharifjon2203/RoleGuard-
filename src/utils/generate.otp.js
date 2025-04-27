import speakeasy from "speakeasy";

export const generateOtp = async () => {
    const otp = speakeasy.totp({
        secret: 'sakljkdfsjjskdajf',
        encoding: "base32",
    });

    return otp;
};

export const verifyOtp = async (code) => {
    const isValid = speakeasy.totp.verify({
        secret: 'sakljkdfsjjskdajf',
        encoding: "base32",
        token: code,
        window: 3,  // urinishlar soni
    });

    return isValid
};
