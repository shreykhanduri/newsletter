const EmailService = require('./email.service');

const queue = 'email-task';
const config = require('./config');
const open = require('amqplib').connect(config.amqp);

// Publisher
const publishMessage = payload => open.then(connection => connection.createChannel())
  .then(channel => channel.assertQueue(queue)
    .then(() => channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))))
  .catch(error => console.warn(error));

// Consumer
const consumeMessage = () => {
  open.then(connection => connection.createChannel()).then(ch => ch.assertQueue(queue).then(() => {
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    return ch.consume(queue, (msg) => {
      if (msg !== null) {
        const { mail, subject, text } = JSON.parse(msg.content.toString());
        console.log(' [x] Received %s', mail);
        // send email via smtp
        EmailService.sendMail(mail,subject,text,ch,msg).then(() => {
        
        });
      }
    });
  })).catch(error => console.warn(error));
};

module.exports = {
  publishMessage,
  consumeMessage
}
require('make-runnable');