import * as tf from "@tensorflow/tfjs"
const getModel = async() => {
    const model = await tf.loadLayersModel("https://storage.googleapis.com/ml-model-cloudraya-bucket/model.json");
} 

export const model = getModel()