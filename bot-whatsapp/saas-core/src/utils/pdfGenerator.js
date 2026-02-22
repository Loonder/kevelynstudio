const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { formatCurrency } = require('./index'); // Assuming utils/index has this, or I'll define it locally

/**
 * Gera um recibo em PDF para o Cliente.
 * @param {string} patientName - Nome do Cliente
 * @param {string} cpf - CPF (Opcional, pode ser 'Não informado')
 * @param {number} amount - Valor do pagamento
 * @param {string} serviceName - Descrição do serviço
 * @returns {Promise<string>} - Caminho do arquivo gerado
 */
async function generateReceipt(patientName, cpf, amount, serviceName) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const filename = `Recibo_${patientName.replace(/ /g, '_')}_${Date.now()}.pdf`;
            const outPath = path.join(__dirname, '../../public/receipts'); // Pasta pública temporária setada no server express?
            // Ou melhor, salvar na pasta 'temp' e mandar pelo zap, depois apagar.
            const tempDir = path.join(__dirname, '../../temp');

            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

            const filePath = path.join(tempDir, filename);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // ─── Cabeçalho ───
            // Se tiver logo: doc.image('path/to/logo.png', 50, 45, { width: 50 });
            doc.fontSize(20).text('RECIBO DE PAGAMENTO', { align: 'center' });
            doc.moveDown();

            // ─── Dados da Psicóloga ───
            doc.fontSize(12).font('Helvetica-Bold').text('Gabriela Kevelyn', { align: 'left' });
            doc.font('Helvetica').text('Master Artist & Lash Designer');
            doc.text('Av. Belo Horizonte, 34 - Parque Paraiso, Itapecerica da Serra - SP');
            doc.moveDown();
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Linha divisória
            doc.moveDown();

            // ─── Corpo do Recibo ───
            const valorFormatado = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const dataHoje = dayjs().format('DD/MM/YYYY');

            doc.fontSize(14).text(`Valor: ${valorFormatado}`, { align: 'right' });
            doc.moveDown();

            doc.fontSize(12).text('Recebi de ', { continued: true }).font('Helvetica-Bold').text(patientName, { continued: true }).font('Helvetica').text(` (CPF: ${cpf || 'Não informado'}),`);

            doc.text(`A importância de ${valorFormatado}, referente a serviços de Estética e Lash Design (${serviceName}).`);

            doc.moveDown();
            doc.text(`São Paulo, ${dataHoje}.`);

            doc.moveDown(4);

            // ─── Assinatura ───
            // doc.image('path/to/signature.png', 200, doc.y, { width: 150 });
            doc.text('________________________________________________', { align: 'center' });
            doc.text('Gabriela Kevelyn', { align: 'center' });
            doc.text('CPF/CNPJ: 000.000.000-00', { align: 'center' }); // Placeholder ou config

            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { generateReceipt };








