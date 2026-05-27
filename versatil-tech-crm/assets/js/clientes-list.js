document.addEventListener('DOMContentLoaded', () => {
  // ===== Config & Estado =====
  const PAGE_SIZE = 25;
  let state = {
    data: [],
    filtered: [],
    sortKey: 'codigo',
    sortDir: 'asc',
    page: 1,
    expandedRows: new Set()
  };

  // ===== Referências =====
  const tbody = document.getElementById('clientsTableBody');
  const searchInput = document.getElementById('searchInput');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const exportBtn = document.getElementById('exportSelectedBtn') || document.getElementById('exportCsv') || document.querySelector('.btn-export');
  const rangeInfo = document.getElementById('rangeInfo') || { textContent: '' };
  const totalInfo = document.getElementById('totalInfo') || { textContent: '' };
  const pagination = document.getElementById('pagination') || createPagination();
  const sortableHeaders = document.querySelectorAll('th.sortable');

  function createPagination() {
    const wrap = document.createElement('div');
    wrap.id = 'pagination';
    wrap.className = 'pagination';
    const tableContainer = (tbody && tbody.closest('.table-container')) || document.body;
    tableContainer.appendChild(wrap);
    return wrap;
  }

  // ===== Dataset (DADOS COM ACESSOS HIGIENIZADOS) =====
  const seed = [
    // ===== REDE MASTER =====
    { codigo: 2987, nome: 'AUTO POSTO MASTER MOGI LTDA', cnpj: '26.602.992/0001-10', rede: 'Rede Master',
      accesses: [{ estacao: 'PDV PISTA NOVA', tipo: 'Anydesk', id: '184920391', senha: 'DemoPass2026!' }] },
    { codigo: 3067, nome: 'AUTO POSTO ECO GAS LTDA', cnpj: '57.900.011/0001-45', rede: 'Rede Master',
      accesses: [
        { estacao: 'PDV PISTA', tipo: 'Anydesk', id: '293847561', senha: 'passWord99#' },
        { estacao: 'RET - GERENTE', tipo: 'Anydesk', id: '992837465', senha: 'passWord99#' }
      ] },
    { codigo: 3175, nome: 'MASTER VALE AUTO POSTO LTDA', cnpj: '11.233.578/0001-04', rede: 'Rede Master',
      accesses: [
        { estacao: 'RET - GERENTE', tipo: 'Anydesk', id: '109283746', senha: 'Secure88@' },
        { estacao: 'PDV PISTA NOVO', tipo: 'Anydesk', id: '882736451', senha: 'Secure88@' }
      ] },
    { codigo: 3037, nome: 'AUTO POSTO GUAIAMASTER LTDA', cnpj: '15.042.777/0001-96', rede: 'Rede Master',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '772635441', senha: 'loginTemp2026' },
        { estacao: 'PDV PISTA', tipo: 'Anydesk', id: '192837465', senha: 'loginTemp2026' }
      ] },
    { codigo: 3035, nome: 'LEAO CENTER AUTO POSTO LEDA', cnpj: '18.019.333/0001-28', rede: 'Rede Master',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '334455667', senha: 'userPass77*' },
        { estacao: 'PISTA / SYNC / SERVIDOR PDV', tipo: 'Anydesk', id: '998877665', senha: 'userPass77*' }
      ] },
    { codigo: 3036, nome: 'M SUPER COMBUSTIVEIS E LUBRIFICANTES LTDA', cnpj: '05.591.088/0001-87', rede: 'Rede Master',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '121234345', senha: 'superPass2026' },
        { estacao: 'RETAGUARDA 2', tipo: 'Anydesk', id: '565678789', senha: 'superPass2026' },
        { estacao: 'PDV / LOJA', tipo: 'Anydesk', id: '909012123', senha: 'superPass2026' },
        { estacao: 'PDV PISTA / SERV / SYNC / MOBILE', tipo: 'Anydesk', id: '767654543', senha: 'superPass2026' }
      ] },
    { codigo: 4234, nome: 'POSTO PARAENSE LTDA', cnpj: '19.863.197/0001-10', rede: 'Rede Master',
      accesses: [
        { estacao: 'PISTA/BD/AUT/SYNC', tipo: 'Anydesk', id: '434321212', senha: 'paraense2026#' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '556677889', senha: 'paraense2026#' }
      ] },
    { codigo: 4565, nome: 'ARGETAX PARTICIPACOES E EMPREENDIMENTOS (ELISEU)', cnpj: '04.383.988/0004-19', rede: 'Rede Master',
      accesses: [
        { estacao: 'PDV PISTA / SYNC', tipo: 'Anydesk', id: '343456567', senha: 'argetax2026!' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '898901012', senha: 'argetax2026!' },
        { estacao: 'RETAGUARDA_LOCAL', tipo: 'Anydesk', id: '232345456', senha: 'argetax2026!' },
        { estacao: 'LOJA', tipo: 'Anydesk', id: '676789890', senha: 'argetax2026!' }
      ] },
    { codigo: 4564, nome: 'ARGETAX PARTICIPACOES E EMPREENDIMENTOS (ROTARY-GUARULHOS)', cnpj: '04.383.988/0003-38', rede: 'Rede Master',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '112233445', senha: 'rotary2026' },
        { estacao: 'PISTA/BD/SYNC/AUT', tipo: 'Anydesk', id: '667788990', senha: 'rotary2026' }
      ] },
    { codigo: 4563, nome: 'ARGETAX PARTICIPACOES E EMPREENDIMENTOS (REGINO ARAGÃO) ANCHIETA', cnpj: '04.383.988/0002-57', rede: 'Rede Master',
      accesses: [
        { estacao: 'NEW PDV PISTA/SYNC/AUTO', tipo: 'Anydesk', id: '554433221', senha: 'anchieta2026' },
        { estacao: 'PDV PISTA / SYNC / AUTO', tipo: 'Anydesk', id: '121314151', senha: 'anchieta2026' }
      ] },
    { codigo: 4566, nome: 'ARGETAX PARTICIPACOES E EMPREENDIMENTOS (CELSO GARCIA)', cnpj: '04.383.988/0005-08', rede: 'Rede Master',
      accesses: [
        { estacao: 'CAIXA / SYNC', tipo: 'Anydesk', id: '909988776', senha: 'celso2026' }
      ] },
    { codigo: 4762, nome: 'GASCEM AUTOMOTIVO LTDA', cnpj: '04.270.177/0001-69', rede: 'Rede Master',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '343456789', senha: 'gascem2026' },
        { estacao: 'LOJA', tipo: 'Anydesk', id: '232345678', senha: 'gascem2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '454567890', senha: 'gascem2026' },
        { estacao: 'SGAMONITOR', tipo: 'Anydesk', id: '676789012', senha: 'gascem2026' },
        { estacao: 'RET_GASCEM', tipo: 'Anydesk', id: '898901234', senha: 'gascem2026' }
      ] },
    { codigo: 5167, nome: 'AUTO POSTO MASTER KING LTDA', cnpj: '38.194.251/0001-27', rede: 'Rede Master',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '112233999', senha: 'king2026#' },
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '887766554', senha: 'king2026#' }
      ] },
    { codigo: 4154, nome: 'AUTO POSTO MASTER TAUBATE (PAO DE QUEIJO)', cnpj: '16.903.290/0001-13', rede: 'Rede Master',
      accesses: [
        { estacao: 'PISTA / SYNC / SGAAUTOMACAO', tipo: 'Anydesk', id: '554433220', senha: 'taubate2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '223344556', senha: 'taubate2026' }
      ] },
    { codigo: 6136, nome: 'AUTO POSTO MASTER CIDADE LTDA', cnpj: '47.759.225/0001-90', rede: 'Rede Master',
      accesses: [
        { estacao: 'PISTA 01 / SYNC / SGAAUTOMACAO', tipo: 'Anydesk', id: '889900112', senha: 'cidade2026' },
        { estacao: 'PISTA 02', tipo: 'Anydesk', id: '445566778', senha: 'cidade2026' }
      ] },
    { codigo: 6137, nome: 'ECOPOSTO AVATARES LTDA', cnpj: '10.555.297/0001-05', rede: 'Rede Master',
      accesses: [
        { estacao: 'PISTA/AUT/BD/MOBILE/PAY', tipo: 'Anydesk', id: '334455661', senha: 'eco2026' }
      ] },
    { codigo: 6244, nome: 'CONVENIENCIA ELISEU (REDE MASTER)', cnpj: '54.600.834/0005-90', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA / SYNC / TEF', tipo: 'Anydesk', id: '778899001', senha: 'conv2026' }
      ] },
    { codigo: 6204, nome: 'MASTER CIDADE CONVENIENCIA (REDE MASTER)', cnpj: '54.600.834/0008-33', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA / SYNC / TEF', tipo: 'Anydesk', id: '221133445', senha: 'cidConv2026' }
      ] },
    { codigo: 6260, nome: 'MASTER CONVENIENCIA LTDA (ANCHIETA)', cnpj: '54.600.834/0007-52', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA / SYNC / TEF', tipo: 'Anydesk', id: '665544332', senha: 'anchietaConv2026' }
      ] },
    { codigo: 6271, nome: 'MASTER CONVENIENCIA LTDA (CHICO PONTES)', cnpj: '54.600.834/0004-00', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA / SYNC / TEF', tipo: 'Anydesk', id: '443322110', senha: 'chicoConv2026' }
      ] },
    { codigo: 6279, nome: 'MASTER CONVENIENCIA LTDA (CONV ROTARY)', cnpj: '54.600.834/0006-71', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA / SYNC / TEF', tipo: 'Anydesk', id: '112233448', senha: 'rotaryConv2026' }
      ] },
    { codigo: 6287, nome: 'MASTER CONVENIENCIA (MSUPER)', cnpj: '54.600.834/0002-48', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA/BANCO/SYNC', tipo: 'Anydesk', id: '556677881', senha: 'msuper2026' }
      ] },
    { codigo: 6288, nome: 'MASTER CONVENIENCIA (MASTER MOGI)', cnpj: '54.600.834/0003-29', rede: 'Rede Master',
      accesses: [
        { estacao: 'LOJA / SYNC / TEF', tipo: 'Anydesk', id: '990011223', senha: 'mogiConv2026' }
      ] },
    { codigo: 6486, nome: 'AUTO POSTO MASTER CHICO LTDA', cnpj: '48.103.506/0001-52', rede: 'Rede Master',
      accesses: [
        { estacao: 'PISTA / BD / AUT SERIAL (CBC) / SYNC', tipo: 'Anydesk', id: '223344559', senha: 'chico2026' }
      ] },
    { codigo: 6552, nome: 'TORINO AUTO POSTO LTDA', cnpj: '50.770.353/0001-49', rede: 'Rede Master',
      accesses: [
        { estacao: 'PDV PISTA - SERVIDOR', tipo: 'Anydesk', id: '119988776', senha: 'torino2026' }
      ] },

    // ===== REDE MORELLO =====
    { codigo: 5341, nome: 'AUTO POSTO F3 LTDA', cnpj: '12.194.868/0001-59', rede: 'Rede Morello',
      accesses: [
        { estacao: 'AJUSTE', tipo: 'Anydesk', id: '998877661', senha: 'morelloPass2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '554433221', senha: 'morelloPass2026' },
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '221133445', senha: 'morelloPass2026' }
      ] },
    { codigo: 5382, nome: 'AUTO POSTO DS LTDA', cnpj: '08.657.258/0001-77', rede: 'Rede Morello',
      accesses: [
        { estacao: 'AJUSTE', tipo: 'Anydesk', id: '443322110', senha: 'ds2026*' },
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '665544332', senha: 'ds2026*' }
      ] },
    { codigo: 5383, nome: 'AUTO POSTO SETE DE TAUBATE LTDA', cnpj: '71.701.650/0001-02', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '334455667', senha: 'sete2026' },
        { estacao: 'AJUSTE', tipo: 'Anydesk', id: '889900112', senha: 'sete2026' }
      ] },
    { codigo: 5459, nome: 'AUTO POSTO AZALEIA LTDA', cnpj: '07.842.034/0001-72', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '445566778', senha: 'azaleia2026' },
        { estacao: 'RETAGUARDA / RESERVA', tipo: 'Anydesk', id: '112233448', senha: 'azaleia2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '1921681515', senha: 'azaleia2026' }
      ] },
    { codigo: 5460, nome: 'AUTO POSTO BRANCO DE CASTELO LTDA (FILIAL 01)', cnpj: '68.912.864/0002-02', rede: 'Rede Morello',
      accesses: [
        { estacao: 'RETAGUARDA/AJUSTE', tipo: 'Anydesk', id: '556677881', senha: 'branco12026' },
        { estacao: 'PDV AJUSTE/BD/SGAMONITOR', tipo: 'Anydesk', id: '990011223', senha: 'branco12026' },
        { estacao: 'PISTA/AUT/BD/SYNC NOVO', tipo: 'Anydesk', id: '223344559', senha: 'branco12026' }
      ] },
    { codigo: 5461, nome: 'AUTO POSTO ITAIM DE TAUBATE II LTDA', cnpj: '19.343.992/0001-88', rede: 'Rede Morello',
      accesses: [
        { estacao: 'RETAGUARDA/AJUSTE', tipo: 'Anydesk', id: '119988776', senha: 'itaim2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '1921680511', senha: 'itaim2026' },
        { estacao: 'LOJA', tipo: 'Anydesk', id: '443322119', senha: 'itaim2026' },
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '665544330', senha: 'itaim2026' }
      ] },
    { codigo: 5494, nome: 'AUTO POSTO BRANCO DE CASTELO LTDA (MATRIZ)', cnpj: '68.912.864/0001-13', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '334455660', senha: 'brancoMat2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '192168885', senha: 'brancoMat2026' },
        { estacao: 'AJUSTE', tipo: 'Anydesk', id: '889900119', senha: 'brancoMat2026' }
      ] },
    { codigo: 5495, nome: 'AUTO POSTO BRANCO DE CASTELO LTDA (FILIAL 02)', cnpj: '68.912.864/0003-85', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PDV GNV (TERMINAL INDIVIDUAL)', tipo: 'Anydesk', id: '445566770', senha: 'branco22026' },
        { estacao: 'RESERVA (AJUSTE)', tipo: 'Anydesk', id: '112233447', senha: 'branco22026' },
        { estacao: 'PDV AJUSTE/BD/SGAMONITOR', tipo: 'Anydesk', id: '192168155', senha: 'branco22026' },
        { estacao: 'PISTA / SYNC / AUT / SGAREST', tipo: 'Anydesk', id: '665544331', senha: 'branco22026' }
      ] },
    { codigo: 5496, nome: 'AUTO POSTO CENTRAL DE JACAREI LTDA', cnpj: '30.796.459/0001-04', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '334455662', senha: 'jacarei2026' },
        { estacao: 'RESERVA', tipo: 'Anydesk', id: '889900118', senha: 'jacarei2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '445566779', senha: 'jacarei2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '192168151', senha: 'jacarei2026' },
        { estacao: 'LOJA', tipo: 'Anydesk', id: '112233446', senha: 'jacarei2026' }
      ] },
    { codigo: 5497, nome: 'AUTO POSTO LUCKY LT', cnpj: '65.823.049/0001-90', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC/MOBILE/SGAREST', tipo: 'Anydesk', id: '665544333', senha: 'lucky2026' },
        { estacao: 'RETAGUARDA/AJUSTE', tipo: 'Anydesk', id: '334455664', senha: 'lucky2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '192168050', senha: 'lucky2026' }
      ] },
    { codigo: 5498, nome: 'AUTO POSTO PENSILVANIA LTDA', cnpj: '58.890.443/0001-85', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC/MOBILE/SGAREST', tipo: 'Anydesk', id: '889900117', senha: 'pensilvania2026' },
        { estacao: 'RETAGUARDA/ RESERVA', tipo: 'Anydesk', id: '445566771', senha: 'pensilvania2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '192168150', senha: 'pensilvania2026' }
      ] },
    { codigo: 5499, nome: 'AUTO POSTO VARIANTE L.N.G LTDA', cnpj: '59.727.917/0001-35', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC/MOBILE/SGAREST', tipo: 'Anydesk', id: '112233449', senha: 'variante2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '192168050', senha: 'variante2026' }
      ] },
    { codigo: 5500, nome: 'CRIS AUTO POSTO LTDA', cnpj: '44.339.638/0001-27', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC/MOBILE/SGAREST', tipo: 'Anydesk', id: '665544334', senha: 'cris2026' },
        { estacao: 'IP/PDV/ SERVIDOR SGAREST', tipo: 'Anydesk', id: '192168050', senha: 'cris2026' }
      ] },
    { codigo: 5906, nome: 'POSTO SAO GERALDO TAUBATE LTDA', cnpj: '43.578.954/0001-99', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/BD/AUT/SYNC', tipo: 'Anydesk', id: '334455665', senha: 'sgeraldo2026' }
      ] },
    { codigo: 6291, nome: 'COMERCIO DE COMBUSTIVEIS FJP LTDA (POSTO VITORIA)', cnpj: '05.971.570/0001-42', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PISTA/BD/AUT/SYNC/SGAREST', tipo: 'Anydesk', id: '889900110', senha: 'vitoria2026' },
        { estacao: 'PDV AJUSTE', tipo: 'Anydesk', id: '445566772', senha: 'vitoria2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '112233440', senha: 'vitoria2026' }
      ] },
    { codigo: 7011, nome: 'AUTO POSTO MORELLO LTDA', cnpj: '61.875.112/0001-80', rede: 'Rede Morello',
      accesses: [
        { estacao: 'PDV PISTA - SERVIDOR', tipo: 'Anydesk', id: '665544335', senha: 'morello2026' }
      ] },

    // ===== REDE TAI =====
    { codigo: 3141, nome: 'AUTO POSTO CENTER VILLE DE ARUJA LTDA', cnpj: '05.308.942/0001-55', rede: 'Rede TAI',
      accesses: [
        { estacao: 'SERVIDOR/SYNC/MOBILE/RET', tipo: 'Anydesk', id: '334455666', senha: 'ville2026' },
        { estacao: 'PISTA/AUT', tipo: 'Anydesk', id: '889900111', senha: 'ville2026' }
      ] },
    { codigo: 4920, nome: 'AUTO POSTO TOMAHAWK LTDA', cnpj: '45.124.720/0001-05', rede: 'Rede TAI',
      accesses: [
        { estacao: 'LOJA', tipo: 'Anydesk', id: '445566773', senha: 'tomahawk2026' },
        { estacao: 'NEW PDV PISTA / SERVIDOR', tipo: 'Anydesk', id: '112233441', senha: 'tomahawk2026' }
      ] },
    { codigo: 4927, nome: 'DALLAS POSTO DE SERVICOS LTDA', cnpj: '23.500.966/0001-93', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PDV PISTA / SYNC / SERV PDV', tipo: 'Anydesk', id: '665544336', senha: 'dallas2026' },
        { estacao: 'Novo PDV', tipo: 'Anydesk', id: '334455667', senha: 'dallas2026' }
      ] },
    { codigo: 4993, nome: 'AUTO POSTO E SERVIÇOS 02 AMIGOS', cnpj: '44.586.995/0001-90', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PDV PISTA / SYNC / MOBILE', tipo: 'Anydesk', id: '889900112', senha: 'amigos2026' },
        { estacao: 'RETAGUARDA (GERENTE)', tipo: 'Anydesk', id: '445566774', senha: 'amigos2026' },
        { estacao: 'ANYDESK LOJA', tipo: 'Anydesk', id: '112233442', senha: 'amigos2026' }
      ] },
    { codigo: 5313, nome: 'CENTRO AUTOMOTIVO ALTO DA BOA VISTA LTDA', cnpj: '18.256.272/0001-12', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PISTA/AUT/BD/SYNC', tipo: 'Anydesk', id: '665544337', senha: 'boaVista2026' }
      ] },
    { codigo: 5314, nome: 'AUTO POSTO BOLZANO LTDA', cnpj: '15.667.027/0001-00', rede: 'Rede TAI',
      accesses: [
        { estacao: 'LOJA', tipo: 'Anydesk', id: '334455668', senha: 'bolzano2026' },
        { estacao: 'PDV PISTA', tipo: 'Anydesk', id: '889900113', senha: 'bolzano2026' }
      ] },
    { codigo: 5309, nome: 'AUTO POSTO JOIA DE DIADEMA LTDA', cnpj: '96.392.170/0001-38', rede: 'Rede TAI',
      accesses: [
        { estacao: 'LOJA & PISTA / BD PDV / SGAAUTOMACAO', tipo: 'Anydesk', id: '445566775', senha: 'joia2026' }
      ] },
    { codigo: 5323, nome: 'AUTO POSTO SABRINA LTDA', cnpj: '48.627.709/0001-48', rede: 'Rede TAI',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '112233443', senha: 'sabrina2026' },
        { estacao: 'PISTA / AUT / SYNC / BANCO DE DADOS PDV', tipo: 'Anydesk', id: '665544338', senha: 'sabrina2026' }
      ] },
    { codigo: 5402, nome: 'AUTO POSTO SERRA DO MAR LTDA', cnpj: '62.239.447/0001-75', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PISTA/SYNC/MOBILE', tipo: 'Anydesk', id: '334455669', senha: 'serra2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '889900114', senha: 'serra2026' },
        { estacao: 'CONVENIENCIA', tipo: 'Anydesk', id: '445566776', senha: 'serra2026' }
      ] },
    { codigo: 5588, nome: 'AUTO POSTO BENFICA LTDA', cnpj: '41.573.562/0001-01', rede: 'Rede TAI',
      accesses: [
        { estacao: 'LOJA', tipo: 'Anydesk', id: '112233444', senha: 'benfica2026' },
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '665544339', senha: 'benfica2026' },
        { estacao: 'PISTA / SYNC / MOBILE / AUT', tipo: 'Anydesk', id: '334455660', senha: 'benfica2026' }
      ] },
    { codigo: 5698, nome: 'AUTO POSTO JOSE ODORIZZI LTDA', cnpj: '41.132.240/0001-27', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PISTA / AUT / BANCO PDV / SYNC / MOBILE', tipo: 'Anydesk', id: '889900115', senha: 'odorizzi2026' },
        { estacao: 'LOJA', tipo: 'Anydesk', id: '445566777', senha: 'odorizzi2026' }
      ] },
    { codigo: 5735, nome: 'EMPRESA 4B DE SERVICOS AUTOMOTIVOS LTDA', cnpj: '00.541.478/0001-29', rede: 'Rede TAI',
      accesses: [
        { estacao: 'LOJA', tipo: 'Anydesk', id: '112233445', senha: '4b2026' },
        { estacao: 'PISTA / BANCO PDV / SYNC / MOBILE', tipo: 'Anydesk', id: '665544331', senha: '4b2026' }
      ] },
    { codigo: 5912, nome: 'POSTO PRINCESA DO JACANA LTDA', cnpj: '52.650.904/0001-66', rede: 'Rede TAI',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '334455662', senha: 'princesa2026' },
        { estacao: 'PISTA/BD/AUT/SYNC', tipo: 'Anydesk', id: '889900116', senha: 'princesa2026' }
      ] },
    { codigo: 6122, nome: 'AUTO POSTO NICE DE INTERLAGOS LTDA.', cnpj: '29.860.499/0001-99', rede: 'Rede TAI',
      accesses: [
        { estacao: 'RETAGUARDA', tipo: 'Anydesk', id: '445566778', senha: 'nice2026' },
        { estacao: 'PISTA/AUT/BD/MOBILE', tipo: 'Anydesk', id: '112233446', senha: 'nice2026' }
      ] },
    { codigo: 6878, nome: 'POSTO DE SERVICOS PORTAL DE ITAPECERICA LTDA', cnpj: '00.272.991/0001-61', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PISTA / SYNC / MOBILE / AUT', tipo: 'Anydesk', id: '665544332', senha: 'portal2026' },
        { estacao: 'LOJA', tipo: 'Anydesk', id: '334455663', senha: 'portal2026' },
        { estacao: 'NOVO PISTA / SYNC / MOBILE / AUT', tipo: 'Anydesk', id: '889900117', senha: 'portal2026' }
      ] },
    { codigo: 6879, nome: 'AUTO POSTO DPS LTDA', cnpj: '18.510.104/0001-01', rede: 'Rede TAI', accesses: [] },
    { codigo: 6943, nome: 'SJS POSTO DE COMBUSTIVEL (SAO JOSE DE SANTOS)', cnpj: '59.762.242/0001-65', rede: 'Rede TAI',
      accesses: [
        { estacao: 'PISTA/BD/AUTOMACAO/SYNC', tipo: 'Anydesk', id: '445566779', senha: 'sjs2026' }
      ] },
  ];

  // ===== Utils =====
  const normalize = s => (s || '').toString().toLowerCase();

  function getAccessList(item) {
    let list = Array.isArray(item.accesses) ? item.accesses : [];
    if (!list.length) {
      try {
        const local = JSON.parse(localStorage.getItem(`acessos_${item.codigo}`) || '[]');
        if (Array.isArray(local) && local.length) list = local;
      } catch {}
    }
    return list;
  }

  function buildAccessHTML(item) {
    const list = getAccessList(item);
    if (!list.length) return '—';

    const isExpanded = state.expandedRows.has(item.codigo);
    const maxLines = 4;
    const lines = list.map(a => {
      const est = a.estacao ? `Estação: ${a.estacao}` : '';
      const tip = a.tipo ? `${a.tipo}: ${a.id || '-'}` : (a.id || '');
      const sen = `Senha: ${a.senha || '-'}`;
      return `<span class="acesso-line"><strong>${est}</strong> ${tip} ${sen}</span>`;
    });

    const needsMore = lines.length > maxLines;
    const visible = isExpanded ? lines : lines.slice(0, maxLines);

    return `
      <div class="acessos-wrap ${isExpanded ? 'expanded' : ''}">
        ${visible.join('<br>')}
      </div>
      ${needsMore ? `
        <div class="fade-edge"></div>
        <button class="toggle-access" data-action="toggle-access" data-codigo="${item.codigo}">
          ${isExpanded ? 'ver menos' : 'ver mais (' + (lines.length - maxLines) + ')'}
        </button>
      ` : '' }
    `;
  }

  function sortData(arr, key, dir) {
    const asc = dir === 'asc';
    return arr.slice().sort((a, b) => {
      let A = a[key], B = b[key];
      const nA = Number(A), nB = Number(B);
      const numeric = !isNaN(nA) && !isNaN(nB);
      if (numeric) { A = nA; B = nB; }
      else { A = normalize(A); B = normalize(B); }
      if (A < B) return asc ? -1 : 1;
      if (A > B) return asc ? 1 : -1;
      return 0;
    });
  }

  function applyFilters() {
    const term = normalize(searchInput?.value || '');
    const arr = state.data.filter(it => {
      const hay = `${it.codigo} ${it.nome} ${it.cnpj} ${it.rede}`;
      return normalize(hay).includes(term);
    });
    state.filtered = sortData(arr, state.sortKey, state.sortDir);
    state.page = 1;
    renderTable();
  }

  function getPaged() {
    const total = state.filtered.length;
    const start = (state.page - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);
    return { rows: state.filtered.slice(start, end), start: total ? start + 1 : 0, end: total ? end : 0, total };
  }

  function renderTable() {
    const { rows, start, end, total } = getPaged();

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-message" style="text-align:center;padding:22px;color:var(--cor-texto-secundario)">Nenhum cliente encontrado.</td></tr>`;
      rangeInfo.textContent = '0–0';
      totalInfo.textContent = '0';
      renderPagination(0);
      return;
    }

    tbody.innerHTML = rows.map(r => `
      <tr data-codigo="${r.codigo}" data-nome="${r.nome}" data-cnpj="${r.cnpj}" data-rede="${r.rede || ''}">
        <td class="checkbox-cell"><input type="checkbox" class="row-checkbox"></td>
        <td>${r.codigo}</td>
        <td>${r.nome}</td>
        <td>${r.cnpj}</td>
        <td class="rede-cell">${r.rede || '—'}</td>
        <td class="acessos-cell ${getAccessList(r).length > 4 ? 'has-more' : ''}">
          ${buildAccessHTML(r)}
        </td>
        <td class="actions">
          <a class="action-btn" title="Editar" href="cliente_formulario.html?codigo=${encodeURIComponent(r.codigo)}"><i class="ph ph-pencil-simple"></i></a>
          <button class="action-btn btn-danger" title="Excluir" data-action="delete"><i class="ph ph-trash"></i></button>
        </td>
      </tr>
    `).join('');

    rangeInfo.textContent = `${start}–${end}`;
    totalInfo.textContent = `${total}`;
    if (selectAllCheckbox) selectAllCheckbox.checked = false;

    renderPagination(state.filtered.length);
  }

  function onTbodyClick(ev) {
    const btn = ev.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'delete') {
      const tr = btn.closest('tr');
      const codigo = Number(tr?.dataset?.codigo);
      const nome = tr?.dataset?.nome || 'cliente';
      if (!confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) return;
      if (!confirm(`[AVISO FINAL] Esta ação é PERMANENTE.\nProsseguir com a exclusão?`)) return;
      state.data = state.data.filter(x => x.codigo !== codigo);
      applyFilters();
      alert(`Cliente "${nome}" excluído com sucesso.`);
      return;
    }

    if (action === 'toggle-access') {
      const codigo = Number(btn.dataset.codigo);
      if (state.expandedRows.has(codigo)) state.expandedRows.delete(codigo);
      else state.expandedRows.add(codigo);
      renderTable();
      return;
    }
  }

  function renderPagination(totalCount) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.textContent = '←';
    prev.disabled = state.page <= 1;
    prev.addEventListener('click', () => { state.page = Math.max(1, state.page - 1); renderTable(); });
    pagination.appendChild(prev);

    const pages = buildPageList(state.page, totalPages);
    pages.forEach(p => {
      if (p === '…') {
        const span = document.createElement('span');
        span.className = 'ellipsis';
        span.textContent = '…';
        pagination.appendChild(span);
      } else {
        const btn = document.createElement('button');
        btn.className = 'page-number' + (p === state.page ? ' active' : '');
        btn.textContent = p;
        btn.addEventListener('click', () => { state.page = p; renderTable(); });
        pagination.appendChild(btn);
      }
    });

    const next = document.createElement('button');
    next.className = 'page-btn';
    next.textContent = '→';
    next.disabled = state.page >= totalPages;
    next.addEventListener('click', () => { state.page = Math.min(totalPages, state.page + 1); renderTable(); });
    pagination.appendChild(next);
  }

  function buildPageList(current, total) {
    const maxShown = 7;
    const out = [];
    if (total <= maxShown) { for (let i = 1; i <= total; i++) out.push(i); return out; }
    out.push(1);
    if (current > 3) out.push('…');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) out.push(i);
    if (current < total - 2) out.push('…');
    out.push(total);
    return out;
  }

  // ===== CSV (Exportar selecionados) =====
  function buildCSV(rows) {
    const header = ['codigo', 'razão social', 'cnpj', 'rede', 'acessos'].join(';');
    const lines = rows.map(r => {
      return [
        escapeCsv(r.codigo),
        escapeCsv(r.nome),
        escapeCsv(r.cnpj),
        escapeCsv(r.rede || ''),
        escapeCsv(r.acessos)
      ].join(';');
    });
    return '\uFEFF' + [header, ...lines].join('\n');
  }
  function escapeCsv(v) {
    const s = (v ?? '').toString();
    if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }
  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
  }

  // ===== Eventos =====
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const cbs = tbody.querySelectorAll('.row-checkbox');
      cbs.forEach(cb => { cb.checked = selectAllCheckbox.checked; });
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const selected = [];
      tbody.querySelectorAll('tr').forEach(tr => {
        const cb = tr.querySelector('.row-checkbox');
        if (cb && cb.checked) {
          selected.push({
            codigo: tr.dataset.codigo,
            nome: tr.dataset.nome,
            cnpj: tr.dataset.cnpj,
            rede: tr.dataset.rede || '',
            acessos: tr.querySelector('.acessos-cell')?.innerText?.replace(/\n/g, ' | ') || ''
          });
        }
      });
      if (!selected.length) { alert('Selecione ao menos 1 cliente para exportar.'); return; }
      const csv = buildCSV(selected);
      downloadFile(csv, 'clientes_selecionados.csv', 'text/csv;charset=utf-8;');
    });
  }

  sortableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key || th.dataset.column || 'codigo';
      state.sortDir = (state.sortKey === key && state.sortDir === 'asc') ? 'desc' : 'asc';
      state.sortKey = key;
      sortableHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      state.filtered = sortData(state.filtered, state.sortKey, state.sortDir);
      state.page = 1;
      renderTable();
    });
  });

  tbody.addEventListener('click', onTbodyClick);

  // ===== Bootstrap =====
  state.data = seed.slice();
  state.filtered = seed.slice();
  applyFilters();
});