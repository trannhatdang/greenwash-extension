import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

const isGreenwashing = require("./data/isGreenwashing.json")
const notGreenwashing = require("./data/notGreenwashing.json")

const trainStatements = isGreenwashing.concat(notGreenwashing)

const N_CLASSES=2

const encodeData = async (encoder, statements) =>
{
  const sentences = tasks.map(t =>t.text.toLowerCase());
  const embeddings = await encoder.embed(sentences);
  return embeddings;
};

const trainModel = async encoder =>
{
  const xTrain = await encodeData(encoder trainStatements);
  const yTrain = tf.tensor(
    trainTasks.map(t => [t.label === "isGreenwashing" ? 1 : 0, t.label === "notGreenwashing" ? 1 : 0])
  );

  const model = tf.sequential()

  model.add(
    tf.layers.dense({
        inputShape: [xTrain.shape[1]]
        activation: "softmax",
        units: N_CLASSES
      }),
  );

  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam(0.001),
    metrics: ["accuracy"]
  });


  const lossContainer = document.getElementById("loss-cont");

  await model.fit(xTrain, yTrain, {
    batchSize: 2,
    validationSplit: 0.2,
    shuffle: true,
    epochs: 20,
    callbacks: tfvis.show.fitCallbacks(
      lossContainer,
      ['loss', 'val_loss', 'acc', 'val_acc'],
      {
        callbacks: ['onEpochEnd'],
      },
    ),
  });

  return model;
}

export {trainModel};
