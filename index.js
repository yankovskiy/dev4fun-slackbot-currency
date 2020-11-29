const { App } = require('@slack/bolt');
const currencyService = require('./currency-service');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/currency', async ({command, ack, say}) => {
    await ack();

    await say('Hello world');
});

(async () => {
    await currencyService.start();
    await app.start(process.env.PORT || 3000);

    console.log('Bot currency started');
})();