const axios = require('axios');

const getVats = () => axios.get(`https://euvatrates.com/rates.json`);

async function getPriceWithVat (price,countryCode){
    const vats = await getVats();
    const rates = vats.data.rates;
    const countryVatRate = rates[countryCode].standard_rate;
    return calculateVat(price,countryVatRate);
}

function calculateVat(price,countryVatRate){
    var vatAmount = price *(countryVatRate/100);
    return +price + vatAmount;
}

module.exports.getPriceWithVat = getPriceWithVat;
