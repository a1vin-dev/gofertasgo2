document.addEventListener('DOMContentLoaded', function() {
    const gerarBtn = document.getElementById('gerarBtn');
    const copiarBtn = document.getElementById('copiarBtn');
    const templateSelect = document.getElementById('templateSelect');

    gerarBtn.addEventListener('click', gerarOferta);
    copiarBtn.addEventListener('click', copiarTexto);
});

const frases = {
    abertura: [
        "📢 *Mencionei você!* 😱🚨 *OFERTA BABADOO no ar!*",
        "🚨 *ATENÇÃO!* 😱 *PROMOÇÃO IMPERDÍVEL TE ESPERANDO!*",
        "💥 *NOVIDADE QUENTINHA! BABADOO NA ÁREA!*",
        "🏃💨 *Corre! Promoção de cair o queixo!*",
        "💣 *OFERTA RELÂMPAGO!* ⚡ *Só HOJE!*",
        "🔥 *Desconto surreal te esperando!* Vem ver!",
        "✨ *A oferta que você esperava chegou!*"
    ],
    urgencia: [
        "⏰ *PROMOÇÃO VÁLIDA POR POUCO TEMPO!*",
        "🔥 *DESCONTO NUNCA VISTO! APROVEITA!*",
        "⚠️ *SÓ ENQUANTO DURAR O ESTOQUE!*",
        "🏃💨 *ÚLTIMAS UNIDADES! Não perde essa!*",
        "💥 *APROVEITE AGORA! Amanhã pode não ter mais!*",
        "🚚 *Envio imediato! Corre garantir o seu!*",
        "🚨 *O estoque tá baixando! Corre!*"
    ],
    fechamento: [
        "🛍️ *Garanta já o seu antes que acabe!*",
        "👉 *Clica no link e corre pra aproveitar!*",
        "🎯 *Não deixa pra depois! Seu desconto tá aqui!*",
        "✅ *Aproveita AGORA ou se arrepende depois!*",
        "⚡ *Só clicar e levar! Simples assim!*",
        "🚚 *Frete rápido! Compra garantida!*",
        "🎁 *Presenteie quem você ama ou se presenteie!*"
    ]
};

// 🔗 Link fixo de cupons (não pode ser alterado)
const linkCupons = "https://s.shopee.com.br/2B26Ni9V1y";

function sortear(categoria) {
    const lista = frases[categoria];
    return lista[Math.floor(Math.random() * lista.length)];
}

function gerarOferta() {
    const texto = document.getElementById('textoOriginal').value.trim();
    const templateType = document.getElementById('templateSelect').value;

    if (!texto) {
        alert("Cole seu texto de oferta primeiro!");
        return;
    }

    const produto = extrairProduto(texto);
    const desconto = extrairDado(texto, /Desconto de (até )?(\d+%)/, 2) || "XX%";
    const precoAntigo = extrairDado(texto, /de: ~R\$\s*([\d.,]+)~/i, 1) || "00,00";
    const precoNovo = extrairDado(texto, /por R\$\s*([\d.,]+)/i, 1) || "00,00";
    const link = extrairDado(texto, /(https?:\/\/[^\s]+)/) || "#";

    const produtoAbreviado = abreviarProduto(produto);

    let template = '';

    if (templateType === "compacto") {
        // 🔥 Template Compacto
        template = `${sortear('abertura')}\n\n` +
                   `> *${produtoAbreviado}*\n\n` +
                   `🏷️ *DESCONTO DE ${desconto}*\n\n` +
                   `❌~De R$ ${precoAntigo}~\n` +
                   `🔥 *POR APENAS R$ ${precoNovo}!* 🔥\n\n` +
                   `👉 *Link p/ comprar:* ${link}\n\n` +
                   `🏷️ *Cupons disponíveis aqui* ⤵️\n` +
                   `${linkCupons}\n\n` +
                   `${sortear('urgencia')}`;
    } else {
        // 🔥 Template Original
        const beneficios = extrairBeneficiosDoTitulo(produto);
        template = `${sortear('abertura')}\n\n` +
                   `> *${produto.toUpperCase()}*\n` +
                   `✔️ ${beneficios[0]}\n` +
                   `✔️ ${beneficios[1]}\n` +
                   `✔️ ${beneficios[2]}\n\n` +
                   `🏷️ *DESCONTO DE ${desconto}*\n\n` +
                   `❌~De R$ ${precoAntigo}~\n` +
                   `🔥 *POR APENAS R$ ${precoNovo}!* 🔥\n\n` +
                   `🛍️ *COMPRE AGORA:*\n` +
                   `👉 [LINK DIRETO] ${link}\n\n` +
                   `🏷️ *Cupons disponíveis aqui* ⤵️\n` +
                   `${linkCupons}\n\n` +
                   `${sortear('fechamento')}`;
    }

    document.getElementById('resultado').innerText = template;
    document.getElementById('copiarBtn').style.display = 'block';
}

function abreviarProduto(produto) {
    return produto.split(' ').slice(0, 3).join(' ').toUpperCase();
}

function extrairBeneficiosDoTitulo(titulo) {
    const palavrasChave = [
        'impermeável', 'antiderrapante', 'confortável', 'luxo', 'profissional',
        'elétrico', 'sem fio', 'automático', 'ergonômico', 'resistente',
        'leve', 'compacto', 'durável', 'prático', 'moderno'
    ];

    const palavrasUnicas = [...new Set(
        titulo.toLowerCase()
            .replace(/[^a-zà-ú\s]/g, ' ')
            .split(' ')
            .filter(palavra => palavra.length > 3)
    )];

    const beneficios = [];
    palavrasChave.forEach(function(palavra) {
        if (titulo.toLowerCase().includes(palavra)) {
            beneficios.push(palavra.charAt(0).toUpperCase() + palavra.slice(1));
        }
    });

    palavrasUnicas.forEach(function(palavra) {
        if (beneficios.length < 3 && !palavrasChave.includes(palavra)) {
            beneficios.push(palavra.charAt(0).toUpperCase() + palavra.slice(1));
        }
    });

    const padroes = ["Design Premium", "Alta Durabilidade", "Garantia Estendida"];
    return beneficios.concat(padroes).slice(0, 3);
}

function extrairProduto(texto) {
    const match = texto.match(/> *([^\n<]+)/) || texto.match(/🚨[^>]+>([^\n]+)/);
    return match ? match[1].replace(/[🚨‼️👉🏷️]/g, '').trim() : "PRODUTO";
}

function extrairDado(texto, regex, grupo = 1) {
    const match = texto.match(regex);
    return match ? match[grupo].trim() : null;
}

function copiarTexto() {
    const texto = document.getElementById('resultado').innerText;
    navigator.clipboard.writeText(texto)
        .then(function() {
            const btn = document.getElementById('copiarBtn');
            btn.textContent = '✅ COPIADO!';
            setTimeout(function() {
                btn.textContent = '📋 COPIAR OFERTA';
            }, 2000);
        });
}
