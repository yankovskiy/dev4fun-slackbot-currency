const currencyService = require('./currency-service');

(async () => {
    await currencyService.start();
    console.log(`10 USD = ${currencyService.calculate(10, 'USD', 'RUB')} RUB`);
    console.log(`771.15 рублей = ${currencyService.calculate(771.15, 'RUB', 'USD')} USD`);
    console.log(`10 EUR = ${currencyService.calculate(10, 'EUR', 'USD')} USD`);
    console.log(`11.78 USD = ${currencyService.calculate(11.78, 'USD', 'EUR')} EUR`);
})();