import Wreck from "@hapi/wreck";
import { ml_model } from "./model.js";
import * as tf from "@tensorflow/tfjs";
import db from "../models/index.js";

export const getAnomalyDetect = async (req, h) => {
    try {
        const { vm_id } = req.payload;
        const client_payload = {
            headers: {
                "Content-Type": "application/json",
            },
            payload: JSON.stringify(req.payload),
            json: true,
        };

        let vm_name, user_id, user_email;
        await db.vm_list
            .findOne({
                where: {
                    local_id: vm_id,
                },
            })
            .then((vm) => {
                if (vm) {
                    vm_name = vm.name;
                    user_id = vm.user_id;
                }
            });

        await db.users
            .findOne({
                where: {
                    id: user_id,
                },
            })
            .then((user) => {
                if (user) user_email = user.email;
            });

        let email_body = { vm_name: vm_name, vm_id: vm_id };
        let sendmail_payload = {
            headers: {
                "Content-Type": "application/json",
            },
            payload: JSON.stringify({
                email: user_email,
                email_body: email_body,
                anomaly: true,
            }),
            json: true,
        };

        const sendMail = async (sendmail_payload) => {
            const { res, payload: vm_usage_payload } = await Wreck.post(
                `https://cloudraya.e-cloud.ch/v1/api/gateway/user/send-mail`,
                sendmail_payload,
            );
        };

        let count = 0;
        // let single_anomaly = false;
        let cpu_anomaly_detected = 0;
        let memory_anomaly_detected = 0;
        const maxRepeats = 996;
        const execute = async () => {
            try {
                const { res, payload: vm_usage_payload } = await Wreck.post(
                    `https://cloudraya.e-cloud.ch/v1/api/virtualmachines/usages?start=${count}&size=3`,
                    client_payload,
                );

                let data, predict, result, cpu_data, memory_data;
                for (let i = 0; i <= 1; i++) {
                    if (i === 0) {
                        cpu_data = vm_usage_payload.data.map(
                            (data) => data.cpuUsed,
                        );
                        data = tf.tensor2d([cpu_data]);
                        predict = await ml_model.then((model) => {
                            return model.predict(data);
                        });
                        result = await predict.dataSync();
                        // Promise.all([predict, result]);

                        if (result > 0.5) {
                            console.log("CPU Anomaly");
                            cpu_anomaly_detected++;

                            // Send to email and notif to mobile
                            email_body.anomaly_type = "CPU";
                            // single_anomaly = true;
                            // try {
                            //     await sendMail(sendmail_payload);
                            // } catch (error) {
                            //     console.error(error.message);
                            //     throw error;
                            // }

                            // Save notification in DB
                            await db.notifications.create({
                                user_id: user_id,
                                vm_id: vm_id,
                                message: {
                                    title: `CPU Anomaly Detected`,
                                    description: `Check your virtual machine (${vm_name}) now to make sure the root cause`,
                                    timestamp: Math.floor(Date.now()),
                                },
                            });
                        }
                    } else {
                        memory_data = vm_usage_payload.data.map(
                            (data) => data.memoryUsed,
                        );
                        data = tf.tensor2d([memory_data]);
                        predict = await ml_model.then((model) => {
                            return model.predict(data);
                        });
                        result = await predict.dataSync();
                        // Promise.all([predict, result]);
                        if (result > 0.5) {
                            console.log("Memory Anomaly");
                            memory_anomaly_detected++;

                            // Send to email and notif to mobile
                            email_body.anomaly_type = "Memory";
                            // single_anomaly = true;
                            // try {
                            //     await sendMail(sendmail_payload);
                            // } catch (error) {
                            //     console.error(error.message);
                            //     throw error;
                            // }

                            // Save notification in DB
                            await db.notifications.create({
                                user_id: user_id,
                                vm_id: vm_id,
                                message: {
                                    title: `Memory Anomaly Detected`,
                                    description: `Check your virtual machine (${vm_name}) now to make sure the root cause`,
                                    timestamp: Math.floor(Date.now()),
                                },
                            });
                        }
                    }
                }
                count++;
            } catch (error) {
                return h.response(error).code(500);
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
        return h
            .response({ code: 500, error: err, message: err.message })
            .code(500);
    }
};
