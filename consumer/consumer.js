const { Kafka } = require('kafkajs');
const mysql = require('mysql2');

const kafka = new Kafka({
  clientId: 'log-consumer',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'log-group' });

// Function to insert data into MySQL
async function insertIntoMySQL(logData) {
  const connection = mysql.createConnection({
    host: 'mysql',
    port: '3306',
    user: 'user',
    password: 'password',
    database: 'logs',
  });

  connection.execute(`
              INSERT INTO log_entries (level, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              logData.level,
              logData.message,
              logData.resourceId,
              new Date(logData.timestamp),
              logData.traceId,
              logData.spanId,
              logData.commit,
              logData.metadata ? logData.metadata.parentResourceId : null,
            ],
    function(err, results, fields) {
      // console.log(results); // results contains rows returned by server
      // console.log(fields); // fields contains extra meta data about results, if available
  
      // If you execute same statement again, it will be picked from a LRU cache
      // which will save query preparation time and give better performance
    }
  );
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
  await delay(4000); //delay for kafka to start
  await consumer.connect();
  await consumer.subscribe({ topic: 'logs', fromBeginning: true });
  console.log('consumer connected.........')
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        try{
          const obj = JSON.parse(message.value)
          insertIntoMySQL(obj)
        }
        catch(err){
          console.log('consuming err',err)
        }        
    },
})
  console.log('running')
};

run().catch(console.error);
