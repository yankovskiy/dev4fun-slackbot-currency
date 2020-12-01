const {App} = require('@slack/bolt');
const currencyService = require('./currency-service');
const Modal = require('./modal');

const modal = new Modal();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.view('currency_callback', async ({ack, body, view, client}) => {
    try {
        const amount = view.state.values.amount.valute.value;
        const source = view.state.values.source.valute.selected_option.value;
        const target = view.state.values.target.valute.selected_option.value;
        const user = body.user.id;

        const err = modal.validate(amount, source, target);
        if (err) {
            await ack({
                response_action: 'errors',
                errors: err
            });
        } else {
            await ack();
            const result = currencyService.calculate(amount, source, target);
            const txt = `${amount} ${source} = ${result} ${target}`;

            await client.chat.postMessage({
                channel: user,
                text: txt
            });
        }
    } catch (e) {
        console.error(e);
    }
});

app.command('/currency', async ({command, ack, client}) => {
    await ack();

    try {
        await client.views.open({
            trigger_id: command.trigger_id,
            view:
                {
                    "callback_id": "currency_callback",
                    "type": "modal",
                    "title": {
                        "type": "plain_text",
                        "text": "Валютный калькулятор"
                    },
                    "submit": {
                        "type": "plain_text",
                        "text": "Расчет"
                    },
                    "close": {
                        "type": "plain_text",
                        "text": "Отмена"
                    },
                    "blocks": [
                        {
                            "block_id": "amount",
                            "type": "input",
                            "element": {
                                "type": "plain_text_input",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Количество в исходной валюте"
                                },
                                "action_id": "valute"
                            },
                            "label": {
                                "type": "plain_text",
                                "text": "Исходное количество"
                            }
                        },
                        {
                            "block_id": "source",
                            "type": "input",
                            "element": {
                                "type": "static_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Выберите валюту"
                                },
                                "options": modal.getValuteList(),
                                "action_id": "valute"
                            },
                            "label": {
                                "type": "plain_text",
                                "text": "Исходная валюта"
                            }
                        },
                        {
                            "block_id": "target",
                            "type": "input",
                            "element": {
                                "type": "static_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Выберите валюту"
                                },
                                "options": modal.getValuteList(),
                                "action_id": "valute"
                            },
                            "label": {
                                "type": "plain_text",
                                "text": "Целевая валюта"
                            }
                        }
                    ]
                }

        });
    } catch (e) {
        console.error(e);
    }
});

(async () => {
    await currencyService.start();
    modal.prepare(currencyService.getValute());
    await app.start(process.env.PORT || 3000);

    console.log('Bot currency started');
})();