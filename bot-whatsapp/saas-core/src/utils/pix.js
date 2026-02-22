// CRC16 logic is implemented below

function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
}

function generateCRC16(payload) {
    // CRC-16-CCITT (0xFFFF)
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        let c = payload.charCodeAt(i);
        crc ^= c << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera o payload do Pix (Copia e Cola)
 * @param {string} key - Chave Pix
 * @param {string} name - Nome do Beneficiário (Max 25 chars)
 * @param {string} city - Cidade do Beneficiário (Max 15 chars)
 * @param {number} amount - Valor (Opcional, 0 = livre)
 * @param {string} txid - Identificador da Transação (Opcional, default ***)
 */
function generatePixPayload(key, name, city, amount = 0, txid = '***') {
    const cleanKey = key.replace(/\s/g, ''); // Remove espaços
    const cleanName = name.substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
    const cleanCity = city.substring(0, 15).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanTxid = txid.substring(0, 25);

    // 00 - Payload Format Indicator
    // 01 - Point of Initiation Method (12 = Static, 11 = Dynamic) - Usamos 12
    let payload = [
        formatField('00', '01'),
        formatField('01', '12'),
    ];

    // 26 - Merchant Account Information
    const merchantInfo = [
        formatField('00', 'BR.GOV.BCB.PIX'),
        formatField('01', cleanKey)
    ].join('');
    payload.push(formatField('26', merchantInfo));

    // 52 - Merchant Category Code
    payload.push(formatField('52', '0000'));

    // 53 - Transaction Currency
    payload.push(formatField('53', '986')); // BRL

    // 54 - Transaction Amount (Optional)
    if (amount > 0) {
        payload.push(formatField('54', amount.toFixed(2)));
    }

    // 58 - Country Code
    payload.push(formatField('58', 'BR'));

    // 59 - Merchant Name
    payload.push(formatField('59', cleanName));

    // 60 - Merchant City
    payload.push(formatField('60', cleanCity));

    // 62 - Additional Data Field Template
    const additionalData = [
        formatField('05', cleanTxid)
    ].join('');
    payload.push(formatField('62', additionalData));

    // 63 - CRC16
    payload.push('6304');

    const payloadStr = payload.join('');
    const crc = generateCRC16(payloadStr);

    return payloadStr + crc;
}

module.exports = { generatePixPayload };








