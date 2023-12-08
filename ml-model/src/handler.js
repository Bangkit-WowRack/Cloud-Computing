import Wreck from "@hapi/wreck";
import { ml_model } from "./model.js";
import * as tf from "@tensorflow/tfjs";

export const getAnomalyDetect = async (req, h) => {
    try {
        const client_payload = {
            headers: {
                "Content-Type": "application/json",
            },
            payload: JSON.stringify(req.payload),
            json: true,
        };

        let count = 0;
        let cpu_anomaly_detected = 0;
        let memory_anomaly_detected = 0;
        const maxRepeats = 996;
        const execute = async () => {
            try {
                const { res, payload: vm_usage_payload } = await Wreck.post(
                    `https://cloudraya.e-cloud.ch/v1/api/virtualmachines/usages?start=${count}&size=3`,
                    client_payload
                );

                let data, predict, result, cpu_data, memory_data;
                for (let i = 0; i <= 1; i++) {
                    if (i === 0) {
                        cpu_data = vm_usage_payload.data.map(
                            (data) => data.cpuUsed
                        );
                        data = tf.tensor2d([cpu_data]);
                        predict = await ml_model.then((model) => {
                            return model.predict(data);
                        });
                        result = await predict.dataSync();
                        // Promise.all([predict, result]);

                        if (result > 0.5) {
                            //send to email and notif to mobile
                            console.log("CPU Anomaly");
                            cpu_anomaly_detected++;
                        }
                    } else {
                        memory_data = vm_usage_payload.data.map(
                            (data) => data.memoryUsed
                        );
                        data = tf.tensor2d([memory_data]);
                        predict = await ml_model.then((model) => {
                            return model.predict(data);
                        });
                        result = await predict.dataSync();
                        // Promise.all([predict, result]);
                        if (result > 0.5) {
                            //send to email and notif to mobile
                            console.log("Memory Anomaly");
                            memory_anomaly_detected++;
                        }
                    }
                }

                console.log("Masuk execute");
                count++;
                // if (count >= maxRepeats) {
                //     setTimeout(await execute, 7000);
                // }
            } catch (error) {
                return h.response(error);
            }
        };

        for (let i = 0; i <= maxRepeats; i++) {
            await execute();
        }

        return h
            .response({
                code: 200,
                data: {
                    cpu_anomaly_detected: cpu_anomaly_detected,
                    memory_anomaly_detected: memory_anomaly_detected,
                },
            })
            .code(200);
    } catch (err) {
        return h.response({ code: 500, message: err.message }).code(500);
    }
};
