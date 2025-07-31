export function totalizarLista(lista, campoValor, tituloTotalizador, casasDecimais = 2, condicao = null) {
  const total = lista.reduce((acc, item) => {
    // Se condicao for passada e o item NÃO cumprir, ignora
    if (condicao && !condicao(item)) {
      return acc;
    }

    const valor = parseFloat(item[campoValor]) || 0;
    return acc + valor;
  }, 0);

  const totalFormatado = total.toFixed(casasDecimais);

  return { title: tituloTotalizador, value: totalFormatado, decimal: casasDecimais };
}
