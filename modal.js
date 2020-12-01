class Modal {
    prepare(valuteList) {
        this._valuteList = [{
            "text": {
                "type": "plain_text",
                "text": "RUB"
            },
            "value": "RUB"
        }];

        for (const valute in valuteList) {
            this._valuteList.push({
                "text": {
                    "type": "plain_text",
                    "text": valute
                },
                "value": valute
            });
        }
    }

    getValuteList() {
        return this._valuteList;
    }

    validate(amount, source, target) {
        const errors = {};
        const isNumber = /^[0-9]*[.,]?[0-9]+$/;

        if (!isNumber.test(amount) || parseFloat(amount) <= 0) {
            errors.amount = 'Введите положительное число';
        }

        if (source === target) {
            errors.target = 'Целевая валюта должна быть отлична от исходной';
        }

        if (errors.amount || errors.target) {
            return errors;
        }

        return false;
    }
}

module.exports = Modal;