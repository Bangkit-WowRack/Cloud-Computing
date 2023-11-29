import jwt from "jsonwebtoken";
export const checkDeviceToken = (device_token) => {
    try {
        if (!device_token) throw new Error("Token perangkat tidak ada");
        const jwt_device = jwt.verify(device_token, process.env.SECRET_KEY);
        const { exp: expired_date, user_id, deviceId } = jwt_device;
        const currentTime = Math.floor(Date.now() / 1000);
        if (expired_date < currentTime)
            throw new Error("Token perangkat telah kadaluarsa");
        const deviceData = {
            device_id: deviceId,
            user_id: user_id,
            expired_at: Date.now(),
        };
        return deviceData;
    } catch (error) {
        return error;
    }
};
