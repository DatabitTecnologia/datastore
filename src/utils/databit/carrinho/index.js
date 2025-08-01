import { apiInsert, apiFind, apiExec, apiUpdate } from 'datareact/src/api/crudapi';
import { Decode64, Encode64 } from 'datareact/src/utils/crypto';

const get = (key) => Decode64(sessionStorage.getItem(key));

export const carrinhoCarrinho = async () => {
  try {
    const res = await apiFind('Carrinho', '*', '', `TB02310_CODCLI = '${get('client')}'`);

    if (res.status === 200 && res.data?.codigo) {
      return res.data;
    }

    // Se não existir, cria um novo carrinho
    const novoCarrinho = {
      codemp: get('enterprise'),
      codcli: get('client'),
      condpag: get('payment'),
      tipodesc: get('operation'),
      vend: get('seller'),
      vendacons: get('consumption')
    };

    const insertRes = await apiInsert('Carrinho', novoCarrinho);

    if (insertRes.status === 200 && insertRes.data) {
      const novoRes = await apiFind('Carrinho', '*', '', `TB02310_CODCLI = '${get('client')}'`);
      if (novoRes.status === 200 && novoRes.data?.codigo) {
        return novoRes.data;
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar ou criar cabeçalho do carrinho:', error);
    return null;
  }
};

export const adicionarCarrinho = async (produto, qtde) => {
  try {
    const carrinho = await carrinhoCarrinho();
    if (!carrinho) return null;

    sessionStorage.setItem('store', Encode64(carrinho.codigo));

    const respproduto = await apiFind(
      'ProdmovVW',
      '*',
      '',
      `codemp = '${carrinho.codemp}' and produto = '${produto.codigo ? produto.codigo : produto.produto}'`
    );
    const prodSelec = respproduto.data;

    const resppreco = await apiExec(
      `exec SP02303 'TB02310','${carrinho.codigo}','${produto.codigo ? produto.codigo : produto.produto}','${carrinho.codemp}','${
        carrinho.codcli
      }','TB01008','S',0,'${get('tableprice')}'`,
      'S'
    );
    const produtoPreco = resppreco.data;
    console.log(produtoPreco);
    const itemselec = {
      codemp: carrinho.codemp ?? '00',
      produto: prodSelec.produto,
      codigo: carrinho.codigo,
      custo: produtoPreco[0].custofim,
      perdesc: prodSelec.perdesc ?? 0,
      prunit: produtoPreco[0].precofim,
      qtprod: qtde,
      qtprodb: 0.0,
      situacao: 'A',
      totvalor: 0.0,
      totvalorb: 0.0,
      numserie: null,
      vlrdesc: 0.0,
      vlrdescb: 0.0,
      icms: produtoPreco[0].icmsfim,
      vlricms: 3150.52,
      vlricmsb: 0.0,
      natureza: prodSelec.natureza ?? null,
      percipi: produtoPreco[0].ipifim,
      vlripi: 0.0,
      vlripib: 0.0,
      percst: produtoPreco[0].mvafim,
      vlrst: 0.0,
      vlrstb: 0.0,
      prbackup: produtoPreco[0].precofim,
      tipodesc: null,
      basered: produtoPreco[0].baseredfim,
      baseicms: 0.0,
      baseicmsb: 0.0,
      basest: 0.0,
      basestb: 0.0,
      comissao: produtoPreco[0].comissaofim,
      tabela: produtoPreco[0].tabelafim,
      custocompra: produtoPreco[0].custocomprafim,
      vlrdescacu: 0.0,
      ipiicms: 'N',
      vlrfrete: 0.0,
      vlrfreteb: 0.0,
      vlroutdesp: 0.0,
      vlroutdespb: 0.0,
      aliqimpfat: produtoPreco[0].aliqimpfatfim,
      equip: '',
      item: 0,
      descprod: prodSelec.nomeprod,
      unprod: prodSelec.unprod,
      acrescimo: 0.0,
      codaliqecf: null,
      ativo: 'S',
      icmsfora: 0.0,
      vlricmsfora: 0.0,
      vlricmsforab: 0.0,
      vlrdifaliq: 0.0,
      vlrdifaliqb: 0.0,
      fcp: produtoPreco[0].fcpfim,
      vlrfcp: 0.0,
      vlrfcpb: 0.0,
      partilhaint: 0.0,
      partilhaext: 100.0,
      icmsdentro: 0.0,
      vlricmsdentro: 0.0,
      vlricmsdentrob: 0.0,
      basefcptot: 0.0,
      basefcptotb: 0.0,
      vlrfcptot: 0.0,
      vlrfcptotb: 0.0,
      basefcptotst: 0.0,
      basefcptotstb: 0.0,
      vlrfcptotst: 0.0,
      vlrfcptotstb: 0.0,
      fcpst: produtoPreco[0].fcpstfim,
      vlricmsult: produtoPreco[0].icmsultfim,
      percdif: produtoPreco[0].percdiffim,
      vlricmsdif: 0.0,
      vlricmsdifb: 0.0,
      vlricmsdeson: 0.0,
      vlricmsdesonb: 0.0,
      numped: '',
      itemped: 0,
      vlrbcipi: 0.0,
      vlrbcipib: 0.0,
      aliqcsllret: 0.0,
      aliqcofinsret: 0.0,
      aliqinssret: 0.0,
      aliqirret: 0.0,
      aliqpisret: 0.0,
      retcsll: 'N',
      retcofins: 'N',
      retinss: 'N',
      retir: 'N',
      retpis: 'N',
      vlrcsllret: 0.0,
      vlrcsllretb: 0.0,
      vlrcofinsret: 0.0,
      vlrcofinsretb: 0.0,
      vlrinssret: 0.0,
      vlrinssretb: 0.0,
      vlrirret: 0.0,
      vlrirretb: 0.0,
      vlrpisret: 0.0,
      vlrpisretb: 0.0,
      nomeprod: prodSelec.nomeprod,
      referencia: prodSelec.referencia,
      codbarras: prodSelec.codbarras,
      codauxiliar: prodSelec.codauxiliar,
      nomeun: prodSelec.nomeun,
      codmarca: prodSelec.codmarca,
      nomemarca: prodSelec.nomemarca,
      codgrupo: prodSelec.codgrupo,
      nomegrupo: prodSelec.nomegrupo,
      codsubgrupo: prodSelec.codsubgrupo,
      nomesubgrupo: prodSelec.nomesubgrupo,
      codlocal: prodSelec.codlocal,
      nomelocal: prodSelec.nomelocal,
      ncm: prodSelec.ncm,
      nomencm: prodSelec.nomencm,
      prateleira: prodSelec.prateleira,
      icmsst: produtoPreco[0].icmsstfim,
      aliqissret: 0.0,
      retiss: 'N',
      cst: prodSelec.cst ?? produtoPreco[0].csticmsfim,
      cstcofins: produtoPreco[0].cstcofinsfim,
      cstipi: produtoPreco[0].cstipifim,
      cstpis: produtoPreco[0].cstpisfim,
      vlricmscu: 0.0,
      qtprodun: 0.0,
      vlrissret: 0.0
    };

    let inclusao = true;
    const res = await apiFind(
      'CarrinhoItem',
      '*',
      '',
      `TB02311_CODIGO = '${carrinho.codigo}' AND TB02311_PRODUTO = '${produto.codigo ? produto.codigo : produto.produto}'`
    );

    if (res.status === 200 && res.data?.produto) {
      inclusao = false;
      itemselec.qtprod = res.data.qtprod + qtde;
    }

    // Ajuste dos campos "b"
    Object.keys(itemselec).forEach((key) => {
      if (key.toLowerCase().endsWith('b')) {
        const originalKey = key.slice(0, -1);
        itemselec[key] = inclusao ? 0 : res.data?.[originalKey] ?? 0;
      }
    });

    // Execução dos cálculos fiscais
    const restotais = await apiExec(
      `exec SP02304 '${carrinho.codemp}','TB02310','${carrinho.codigo}','${itemselec.produto}','N',${itemselec.qtprod},${
        itemselec.prunit
      },${itemselec.perdesc},${itemselec.percipi ?? 'N'},'${itemselec.freteipi ?? 'N'}','N',${itemselec.vlrfrete},${itemselec.vlroutdesp},${
        itemselec.icms
      },'${itemselec.cst}',${itemselec.basered},'${itemselec.ipiicms}',${itemselec.icmsst},${itemselec.percst},${itemselec.percdif},${
        carrinho.vlrbruto
      },${carrinho.vlrfrete ?? 0},${carrinho.vlroutdesp ?? 0},'${get('client')}','TB01008','${itemselec.unprod ?? '01'}','${
        itemselec.tabela ?? '01'
      }','${Decode64(sessionStorage.getItem('user'))}',${itemselec.aliqcsllret},${itemselec.aliqcofinsret},${itemselec.aliqinssret},${
        itemselec.aliqirret
      },${itemselec.aliqpisret},${itemselec.aliqissret},'${itemselec.retcsll}','${itemselec.retcofins}','${itemselec.retinss}','${
        itemselec.retir
      }','${itemselec.retpis}','${itemselec.retiss}','C','${carrinho.contabil ?? 'N'}'`,
      'S'
    );

    const totais = restotais.data[0];

    // Aplicar totais calculados ao item
    Object.assign(itemselec, {
      totvalor: totais.totvalor,
      vlrdesc: totais.vlrdesc,
      vlripi: totais.vlripi,
      vlrbcipi: totais.vlrbcipi,
      vlricmsdeson: totais.vlricmsdeson,
      vlricms: totais.vlricms,
      vlricmscu: totais.vlricms,
      baseicms: totais.baseicms,
      basest: totais.basesub,
      basefcptotst: totais.basefcptotst,
      vlrfcptotst: totais.vlrfcptotst,
      fcpst: totais.fcpst,
      vlrst: totais.vlrst,
      fcp: totais.fcp,
      vlrfcp: totais.vlrfcp,
      partilhaint: totais.partilhaint,
      partilhaext: totais.partilhaext,
      icmsdentro: totais.icmsdentro,
      icmsfora: totais.icmsfora,
      vlricmsfora: totais.vlricmsfora,
      basefcptot: totais.basefcptot,
      vlrfcptot: totais.vlrfcptot,
      qtprodun: totais.qtprodun,
      vlricmsdif: totais.vlricmsdif,
      tabela: totais.tabfim,
      vlrpisret: totais.vlrpisret,
      vlrcofinsret: totais.vlrcofinsret,
      vlrirret: totais.vlrirret,
      vlrcsllret: totais.vlrcsllret,
      vlrinssret: totais.vlrinssret,
      vlrissret: totais.vlrissret
    });

    inclusao ? await apiInsert('CarrinhoItem', itemselec) : await apiUpdate('CarrinhoItem', itemselec);
  } catch (error) {
    console.error('Erro ao inserir item ao carrinho:', error);
    return null;
  }
};
