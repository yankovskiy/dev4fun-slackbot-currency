const needle = require('needle');
const debug = require('debug')('service');
const DELAY = 1000 * 60 * 60; // 1 час

class CurrencyService {
    async start() {
        await this._fetchCurrency();
        this.interval = setInterval(this._fetchCurrency, DELAY);
    }

    calculate(sourceAmount, sourceCurrency, targetCurrency) {
        // в рублях
        if (targetCurrency === 'RUB') {
            return (sourceAmount * this._currency.Valute[sourceCurrency].Value / this._currency.Valute[sourceCurrency].Nominal).toFixed(2);
        }

        // рубли в целевую
        if (sourceCurrency === 'RUB') {
            return (sourceAmount / this._currency.Valute[targetCurrency].Value * this._currency.Valute[targetCurrency].Nominal).toFixed(2);
        }

        const inRub = sourceAmount * this._currency.Valute[sourceCurrency].Value / this._currency.Valute[sourceCurrency].Nominal;
        return (inRub / this._currency.Valute[targetCurrency].Value * this._currency.Valute[targetCurrency].Nominal).toFixed(2);
    }

    async _fetchCurrency() {
        try {
            const response = await needle('get', 'https://www.cbr-xml-daily.ru/daily_json.js');
            if (response.statusCode === 200) {
                const data = response.body.toString();
                debug(data);

                this._currency = JSON.parse(data);
            } else {
                console.error('cbr-xml-daily returned', response.statusCode);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = (function() {
    return new CurrencyService();
})();