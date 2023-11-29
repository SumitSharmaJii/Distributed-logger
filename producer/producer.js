const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'log-injestor',
  brokers: ['kafka:9092']
})

// Create producer
const producer = kafka.producer()

// Api
app.post('/', async (req, res) => {
  try {
    const logData = req.body;
    
    // Additional processing or validation of log data can be done here

    //push msg to kafka
    await producer.send({
      topic: 'logs',
      messages: [{ value: JSON.stringify(logData) }],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
  await delay(4000); //delay for kafka to start
  await producer.connect();
  app.listen(port, () => {
    console.log(`Log Ingestor listening at http://localhost:${port}`);
  });
};

run().catch(console.error);