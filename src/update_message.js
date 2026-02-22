require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function updateMessage() {
    const key = 'agendamento_sucesso';
    const newContent = "✅ *Agendamento Confirmado!*\n\nTe aguardo no horário marcado. Até lá! 🌸";

    const { data, error } = await supabase
        .from('bot_messages')
        .update({ content: newContent })
        .eq('key', key);

    if (error) {
        console.error('Erro ao atualizar mensagem:', error);
    } else {
        console.log('Mensagem atualizada com sucesso!');
    }
}

updateMessage();







