import * as tf from "@tensorflow/tfjs";
const getModel = async () => {
    const model = await tf.loadLayersModel(
        "https://storage.googleapis.com/ml-model-cloudraya-bucket/model.json"
    );

    return model;
};

export const ml_model = getModel();
