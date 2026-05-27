document.addEventListener('DOMContentLoaded', () => {
  // ======================================================================
  // CONFIG / SEED (localStorage)
  // ======================================================================
  const CLIENTS_KEY = 'vt_clients_v1';
  const ACCESS_PREFIX = 'acessos_';
  const VERSION_FLAG = 'vt_clients_seed_version_2'; // força re-seed p/ status no objeto

  const SEED_BASE = [
    { codigo: 2987, nome: 'AUTO POSTO MASTER MOGI LTDA', cnpj: '26.602.992/0001-10', rede: 'Rede Master', status: 'Ativo',
      acessos: [{estacao:'PDV PISTA NOVA', tipo:'AnyDesk', id:'726995849', usuario:'', senha:'Redemaster'}] },
    { codigo: 3067, nome: 'AUTO POSTO ECO GAS LTDA', cnpj: '57.900.011/0001-45', rede: 'Rede Esperança', status: 'Ativo',
      acessos: [
        {estacao:'PDV PISTA', tipo:'AnyDesk', id:'628629801', usuario:'', senha:'cmo4lat1'},
        {estacao:'RET - GERENTE', tipo:'AnyDesk', id:'907072440', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 3175, nome: 'MASTER VALE AUTO POSTO LTDA', cnpj: '11.233.578/0001-04', rede: 'Rede Master', status: 'Inativo',
      acessos: [
        {estacao:'RET - GERENTE', tipo:'AnyDesk', id:'502451554', usuario:'', senha:'cmo4lat1'},
        {estacao:'PDV PISTA NOVO', tipo:'AnyDesk', id:'211731358', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 3037, nome: 'AUTO POSTO GUAIAMASTER LTDA', cnpj: '15.042.777/0001-96', rede: 'Rede Master', status: 'Ativo',
      acessos: [
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'452567802', usuario:'', senha:''},
        {estacao:'PDV PISTA', tipo:'AnyDesk', id:'1953156198', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 3035, nome: 'LEAO CENTER AUTO POSTO LEDA', cnpj: '18.019.333/0001-28', rede: 'Rede Master', status: 'Ativo',
      acessos: [
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'795017616', usuario:'', senha:''},
        {estacao:'PISTA / SYNC / SERVIDOR PDV', tipo:'AnyDesk', id:'321894711', usuario:'', senha:'cmo4lat1'},
        {estacao:'LOJA - NOVO', tipo:'AnyDesk', id:'314476490', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 3036, nome: 'M SUPER COMBUSTIVEIS E LUBRIFICANTES LTDA', cnpj: '05.591.088/0001-87', rede: 'Rede Master', status: 'Ativo',
      acessos: [
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'259895890', usuario:'', senha:'cmo4lat1'},
        {estacao:'RETAGUARDA 2', tipo:'AnyDesk', id:'610547388', usuario:'', senha:'cmo4lat1'},
        {estacao:'PDV / LOJA', tipo:'AnyDesk', id:'147275583', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 4234, nome: 'POSTO PARAENSE LTDA', cnpj: '19.863.197/0001-10', rede: 'Rede Martinelli', status: 'Inativo',
      acessos: [
        {estacao:'PISTA/BD/AUT/SYNC', tipo:'AnyDesk', id:'573679152', usuario:'', senha:'cmo4lat1'},
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'978450498', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 4565, nome: 'ARGETAX PART. E EMPREEND. (ELISEU)', cnpj: '04.383.988/0004-19', rede: 'Rede Martinelli', status: 'Ativo',
      acessos: [
        {estacao:'PDV PISTA / SYNC', tipo:'AnyDesk', id:'266056029', usuario:'', senha:'cmo4lat1'},
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'246018006', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 4564, nome: 'ARGETAX PART. (ROTARY-GUARULHOS)', cnpj: '04.383.988/0003-38', rede: 'Rede Martinelli', status: 'Ativo',
      acessos: [
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'146066352', usuario:'', senha:'Redemaster2022'},
        {estacao:'PISTA/BD/SYNC/AUT', tipo:'AnyDesk', id:'1287529850', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 4762, nome: 'GASCEM AUTOMOTIVO LTDA', cnpj: '04.270.177/0001-69', rede: 'Rede Esperança', status: 'Ativo',
      acessos: [
        {estacao:'PISTA/AUT/BD/SYNC', tipo:'AnyDesk', id:'722085641', usuario:'', senha:'cmo4lat1'},
        {estacao:'LOJA', tipo:'AnyDesk', id:'307352270', usuario:'', senha:'cmo4lat1'},
        {estacao:'RETAGUARDA', tipo:'AnyDesk', id:'594766663', usuario:'', senha:'cmo4lat1'}
      ]},
    { codigo: 5167, nome: 'AUTO POSTO MASTER KING LTDA', cnpj: '38.194.251/0001-27', rede: 'Rede Master', status: 'Ativo',
      acessos: [{estacao:'RETAGUARDA', tipo:'AnyDesk', id:'978851284', usuario:'', senha:'redemaster2023'}] },
    { codigo: 4154, nome: 'AUTO POSTO MASTER TAUBATE', cnpj: '16.903.290/0001-13', rede: 'Rede Master', status: 'Inativo',
      acessos: [{estacao:'PISTA / SYNC / SGAAUTOMACAO', tipo:'AnyDesk', id:'1687769141', usuario:'', senha:'SOLICITAR ACEITE'}] },
    { codigo: 6136, nome: 'AUTO POSTO MASTER CIDADE LTDA', cnpj: '47.759.225/0001-90', rede: 'Rede Master', status: 'Ativo',
      acessos: [{estacao:'PISTA 01 / SYNC / SGAAUTOMACAO', tipo:'AnyDesk', id:'106514477', usuario:'', senha:'SOLICITAR ACEITE'}] },
    { codigo: 6137, nome: 'ECOPOSTO AVATARES LTDA', cnpj: '10.555.297/0001-05', rede: 'Rede Esperança', status: 'Ativo',
      acessos: [{estacao:'PISTA/AUT/BD/MOBILE/PAY', tipo:'AnyDesk', id:'1285540600', usuario:'', senha:'cmo4lat1'}] },
    { codigo: 6552, nome: 'TORINO AUTO POSTO LTDA', cnpj: '50.770.353/0001-49', rede: 'Rede Martinelli', status: 'Ativo',
      acessos: [{estacao:'PDV PISTA - SERVIDOR', tipo:'AnyDesk', id:'623726752', usuario:'', senha:'cmo4lat1'}] },
  ];
  const REDES = ['Rede Master', 'Rede Esperança', 'Rede Martinelli'];

  function generateCNPJ(i) {
    const num = String(10000000000000 + i).slice(-14);
    return `${num.slice(0,2)}.${num.slice(2,5)}.${num.slice(5,8)}/${num.slice(8,12)}-${num.slice(12,14)}`;
  }
  function ensure40Clients(seed) {
    const out = [...seed];
    let nextCode = 7001;
    while (out.length < 40) {
      const idx = out.length;
      out.push({
        codigo: nextCode++,
        nome: `AUTO POSTO EXEMPLO ${String(idx + 1).padStart(2,'0')}`,
        cnpj: generateCNPJ(idx + 1),
        rede: REDES[idx % 3],
        status: (idx % 7 === 0) ? 'Inativo' : 'Ativo',
        acessos: (idx % 4 === 0) ? [
          {estacao:'PDV PISTA', tipo:'AnyDesk', id:String(600000000 + idx), usuario:'', senha:'cmo4lat1'}
        ] : []
      });
    }
    return out;
  }
  function loadClients() {
    let arr = [];
    if (!localStorage.getItem(VERSION_FLAG)) {
      arr = ensure40Clients(SEED_BASE);
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(arr));
      arr.forEach(c => {
        if (c.acessos && c.acessos.length) {
          localStorage.setItem(ACCESS_PREFIX + c.codigo, JSON.stringify(c.acessos));
        }
      });
      localStorage.setItem(VERSION_FLAG, '2');
    } else {
      try {
        arr = JSON.parse(localStorage.getItem(CLIENTS_KEY)) || [];
      } catch {
        arr = ensure40Clients(SEED_BASE);
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(arr));
      }
    }
    return arr;
  }
  function saveClients(list) {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
  }

  // Reset manual opcional
  window.VT_CLIENTS_RESET = () => {
    localStorage.removeItem(CLIENTS_KEY);
    localStorage.removeItem(VERSION_FLAG);
    Object.keys(localStorage).forEach(k => { if (k.startsWith(ACCESS_PREFIX)) localStorage.removeItem(k); });
    alert('Banco local de clientes resetado. Recarregue a página.');
  };

  // ======================================================================
  // LISTAGEM (clientes.html)
  // ======================================================================
  const clientsTable = document.getElementById('clientsTable');
  if (clientsTable) {
    const state = { clients: loadClients() };

    const clientsTableBody = document.getElementById('clientsTableBody');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const sortableHeaders = document.querySelectorAll('.sortable');
    const exportBtn = document.querySelector('.btn-export');
    const searchInput = document.getElementById('searchInput');

    // Viewer overlay (igual seu JS antigo)
    ensureViewerDOM();

    renderTable(state.clients);
    bindRowActions();
    renderAccessesIntoCells();  // resumo na célula "Acessos"
    bindViewButton();

    // ---- Busca (texto apenas; sem chips de status)
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        Array.from(clientsTableBody.querySelectorAll('.client-row')).forEach(row => {
          const data = (row.dataset.codigo + row.dataset.nome + row.dataset.cnpj + row.dataset.rede).toLowerCase();
          row.style.display = data.includes(term) ? 'table-row' : 'none';
        });
      });
    }

    // ---- Selecionar todos
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', () => {
        Array.from(clientsTableBody.querySelectorAll('.client-row')).forEach(row => {
          if (row.style.display !== 'none') {
            const cb = row.querySelector('.row-checkbox');
            if (cb) cb.checked = selectAllCheckbox.checked;
          }
        });
      });
    }

    // ---- Ordenação
    if (sortableHeaders.length > 0) {
      sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const column = header.dataset.column;
          const isAscending = !header.classList.contains('sort-asc');
          sortableHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
          header.classList.toggle('sort-asc', isAscending);
          header.classList.toggle('sort-desc', !isAscending);

          const rowsArray = Array.from(clientsTableBody.querySelectorAll('.client-row'));
          rowsArray.sort((a, b) => {
            let valA = a.dataset[column];
            let valB = b.dataset[column];
            const isNumeric = !isNaN(valA) && !isNaN(valB);
            if (isNumeric) { valA = parseFloat(valA); valB = parseFloat(valB); }
            if (valA < valB) return isAscending ? -1 : 1;
            if (valA > valB) return isAscending ? 1 : -1;
            return 0;
          });
          rowsArray.forEach(row => clientsTableBody.appendChild(row));
        });
      });
    }

    // ---- Exportar (CSV com BOM, acentos OK no Excel)
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const selectedCodigos = Array.from(clientsTableBody.querySelectorAll('.client-row'))
          .filter(row => row.querySelector('.row-checkbox')?.checked)
          .map(row => row.dataset.codigo);

        const data = state.clients.filter(c => {
          if (selectedCodigos.length === 0) return true; // nada marcado -> exporta todos
          return selectedCodigos.includes(String(c.codigo));
        });

        exportClientsToCSV(data);
      });
    }

    // ---- Render da tabela (sem coluna Status; botão igual seu JS antigo)
    function renderTable(list) {
      clientsTableBody.innerHTML = '';
      list.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = 'client-row';
        tr.dataset.codigo = c.codigo;
        tr.dataset.nome  = (c.nome || '').toLowerCase();
        tr.dataset.cnpj  = (c.cnpj || '').replace(/\D/g, '');
        tr.dataset.rede  = (c.rede || '').toLowerCase();
        tr.dataset.status = (c.status || 'Ativo').toLowerCase(); // guardamos, mas não exibimos

        tr.innerHTML = `
          <td class="checkbox-cell"><input type="checkbox" class="row-checkbox"></td>
          <td>${c.codigo}</td>
          <td>${escapeHtml(c.nome || '')}</td>
          <td>${escapeHtml(c.cnpj || '')}</td>
          <td>${escapeHtml(c.rede || '')}</td>
          <td class="acessos-cell"></td>
          <td class="actions">
            <button class="action-btn view-access-btn" data-codigo="${c.codigo}" title="Ver informações do cliente">
              <i class="ph ph-identification-badge"></i>
            </button>
            <a class="action-btn" title="Editar" href="cliente_formulario.html?codigo=${encodeURIComponent(c.codigo)}">
              <i class="ph ph-pencil-simple"></i>
            </a>
            <button class="action-btn btn-danger" title="Excluir"><i class="ph ph-trash"></i></button>
          </td>
        `;
        clientsTableBody.appendChild(tr);
      });
    }

    function bindRowActions() {
      clientsTableBody.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.btn-danger[title="Excluir"]');
        if (!btn) return;
        const row = btn.closest('tr');
        const codigo = row?.dataset.codigo;
        const nome = row?.querySelector('td:nth-child(3)')?.textContent?.trim() || 'cliente';
        if (!codigo) return;

        const firstConfirm = confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`);
        if (!firstConfirm) return;
        const secondConfirm = confirm(`[AVISO FINAL] Esta ação é PERMANENTE e não pode ser desfeita.\n\nTodos os tickets, acessos e dados associados a "${nome}" serão perdidos.\n\nProsseguir com a exclusão?`);
        if (!secondConfirm) return;

        const list = loadClients().filter(c => String(c.codigo) !== String(codigo));
        saveClients(list);
        localStorage.removeItem(ACCESS_PREFIX + codigo);
        row.remove();
      });
    }

    function renderAccessesIntoCells() {
      Array.from(clientsTableBody.querySelectorAll('.client-row')).forEach(row => {
        const clientId = row.dataset.codigo;
        const accessData = JSON.parse(localStorage.getItem(ACCESS_PREFIX + clientId) || '[]');
        const accessCell = row.querySelector('.acessos-cell');
        if (!accessCell) return;
        if (accessData.length === 0) { accessCell.innerHTML = ''; return; }
        accessCell.innerHTML = accessData.map(a => {
          const parts = [
            `Estacao: ${a.estacao || '-'}`,
            `${a.tipo || 'Acesso'}: ${a.id || '-'}`,
            `Senha: ${a.senha || '-'}`
          ];
          return parts.join(' | ');
        }).join('<br>');
      });
    }

    // Export (UTF-8 BOM) -> Excel abre acentuação correta
    function exportClientsToCSV(list) {
      const BOM = '\uFEFF';
      const header = ['Codigo','Nome Fantasia','CNPJ','Rede','Acessos'].join(';');
      const lines = list.map(c => {
        const acessos = JSON.parse(localStorage.getItem(ACCESS_PREFIX + c.codigo) || '[]')
          .map(a => `Estacao: ${a.estacao || ''} | ${a.tipo || ''}: ${a.id || ''} | Senha: ${a.senha || ''}`)
          .join(' / ');
        return [
          csvQuote(c.codigo),
          csvQuote(c.nome || ''),
          csvQuote(c.cnpj || ''),
          csvQuote(c.rede || ''),
          csvQuote(acessos)
        ].join(';');
      });
      const csv = BOM + [header, ...lines].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clientes_export_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    function csvQuote(val) {
      const s = String(val ?? '');
      const escaped = s.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, (m) => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
      }[m]));
    }

    // ===== Viewer overlay (igual seu JS antigo) =====
    function bindViewButton() {
      clientsTableBody.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.view-access-btn');
        if (!btn) return;
        const codigo = btn.dataset.codigo;
        openViewer(codigo);
      });
    }

    function ensureViewerDOM() {
      if (document.getElementById('viewerOverlay')) return;
      const overlay = document.createElement('div');
      overlay.id = 'viewerOverlay';
      overlay.className = 'viewer-overlay';
      overlay.innerHTML = `
        <div class="viewer-modal" role="dialog" aria-modal="true" aria-labelledby="viewerTitle">
          <div class="viewer-header">
            <div class="viewer-title" id="viewerTitle">Informações do Cliente</div>
            <button class="viewer-close" id="viewerClose" aria-label="Fechar">&times;</button>
          </div>
          <div class="viewer-body" id="viewerBody"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e)=>{ if (e.target === overlay) closeViewer(); });
      document.getElementById('viewerClose').addEventListener('click', closeViewer);
      document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeViewer(); });
    }
    function closeViewer() {
      const overlay = document.getElementById('viewerOverlay');
      if (overlay) overlay.classList.remove('visible');
    }
    function openViewer(codigo) {
      const overlay = document.getElementById('viewerOverlay');
      const body = document.getElementById('viewerBody');
      if (!overlay || !body) return;

      const all = (function(){ try { return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]'); } catch { return []; } })();
      const cli = all.find(c => String(c.codigo) === String(codigo)) || {};
      const acessos = JSON.parse(localStorage.getItem(ACCESS_PREFIX + codigo) || '[]');
      const obs = (cli.infoAdicionais ? String(cli.infoAdicionais).trim() : '');

      body.innerHTML = `
        <div class="viewer-section">
          <h4>Cliente</h4>
          <div>${escapeHtml(cli.nome || '-')}</div>
          <div><strong>Código:</strong> ${escapeHtml(codigo)} &nbsp;|&nbsp; <strong>CNPJ:</strong> ${escapeHtml(cli.cnpj || '-')} &nbsp;|&nbsp; <strong>Rede:</strong> ${escapeHtml(cli.rede || '-')}</div>
        </div>

        <div class="viewer-section">
          <h4>Observações / Informações Adicionais</h4>
          <div>${obs ? escapeHtml(obs) : '<span class="viewer-empty">Sem observações cadastradas.</span>'}</div>
        </div>

        <div class="viewer-section">
          <h4>Equipamentos e Acesso Remoto</h4>
          ${
            acessos.length === 0
            ? '<div class="viewer-empty">Nenhum acesso cadastrado para este cliente.</div>'
            : `
              <table class="viewer-table">
                <thead>
                  <tr><th>Estação</th><th>Tipo</th><th>ID / Endereço</th><th>Usuário</th><th>Senha</th></tr>
                </thead>
                <tbody>
                  ${acessos.map(a => `
                    <tr>
                      <td>${escapeHtml(a.estacao || '-')}</td>
                      <td>${escapeHtml(a.tipo || '-')}</td>
                      <td>${escapeHtml(a.id || '-')}</td>
                      <td>${escapeHtml(a.usuario || '-')}</td>
                      <td>${escapeHtml(a.senha || '-')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `
          }
        </div>

        <div>
          <a class="btn btn-secondary btn-sm" href="cliente_formulario.html?codigo=${encodeURIComponent(codigo)}">
            <i class="ph ph-pencil-simple"></i> Editar cadastro
          </a>
        </div>
      `;
      overlay.classList.add('visible');
    }
  }

  // ======================================================================
  // FORMULÁRIO (cliente_formulario.html) – pré-preenche via ?codigo=XXXX
  // ======================================================================
  const clienteForm = document.getElementById('clienteForm');
  if (clienteForm) {
    const clients = (function(){
      try { return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || []; } catch { return []; }
    })();

    const params = new URLSearchParams(window.location.search);
    const codigoParam = params.get('codigo');

    const cnpjInput = document.getElementById('cnpj');
    const ieInput = document.getElementById('ie');
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoSelect = document.getElementById('estado');

    const codigoInput = document.getElementById('codigo');
    const nomeFantasiaInput = document.getElementById('nomeFantasia');
    const razaoSocialInput = document.getElementById('razaoSocial');
    const redeSelect = document.getElementById('rede');
    const telefoneInput = document.getElementById('telefone');
    const responsavelInput = document.getElementById('responsavel');
    const emailInput = document.getElementById('email');
    const infoAdicionaisText = document.getElementById('infoAdicionais');
    const statusSelect = document.getElementById('statusCliente'); // se existir no formulário

    function maskCNPJ(value) {
      const digits = value.replace(/\D/g, '').slice(0, 14);
      let out = '';
      if (digits.length > 0) out = digits.slice(0, 2);
      if (digits.length >= 3) out += '.' + digits.slice(2, 5);
      if (digits.length >= 6) out += '.' + digits.slice(5, 8);
      if (digits.length >= 9) out += '/' + digits.slice(8, 12);
      if (digits.length >= 13) out += '-' + digits.slice(12, 14);
      return out;
    }
    function maskIE(value) {
      const clean = value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().slice(0, 15);
      return clean;
    }
    function maskCEP(value) {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length <= 5) return digits;
      return digits.slice(0,5) + '-' + digits.slice(5,8);
    }

    if (cnpjInput) cnpjInput.addEventListener('input', () => {
      const masked = maskCNPJ(cnpjInput.value);
      cnpjInput.value = masked; cnpjInput.setSelectionRange(masked.length, masked.length);
    });
    if (ieInput) ieInput.addEventListener('input', () => {
      const masked = maskIE(ieInput.value);
      ieInput.value = masked; ieInput.setSelectionRange(masked.length, masked.length);
    });
    if (cepInput) {
      cepInput.addEventListener('input', () => {
        const masked = maskCEP(cepInput.value);
        cepInput.value = masked;
        unlockAddressFields();
        if (masked.replace(/\D/g,'').length < 8) {
          enderecoInput && (enderecoInput.value = '');
          bairroInput && (bairroInput.value = '');
          cidadeInput && (cidadeInput.value = '');
        }
      });
      cepInput.addEventListener('blur', tryFillAddressFromCEP);
      cepInput.addEventListener('keyup', () => {
        const digits = cepInput.value.replace(/\D/g, '');
        if (digits.length === 8) tryFillAddressFromCEP();
      });
    }

    async function tryFillAddressFromCEP() {
      const digits = (cepInput?.value || '').replace(/\D/g, '');
      if (!digits || digits.length !== 8) return;
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        if (!res.ok) throw new Error('CEP não encontrado');
        const data = await res.json();
        if (data.erro) throw new Error('CEP inválido');
        if (enderecoInput) enderecoInput.value = data.logradouro || '';
        if (bairroInput) bairroInput.value = data.bairro || '';
        if (cidadeInput) cidadeInput.value = data.localidade || '';
        if (estadoSelect) {
          const uf = (data.uf || '').toUpperCase();
          let hasOption = false;
          Array.from(estadoSelect.options).forEach(opt => {
            if (opt.value.toUpperCase() === uf || opt.textContent.toUpperCase() === uf) hasOption = true;
          });
          if (!hasOption && uf) {
            const opt = document.createElement('option');
            opt.value = uf; opt.textContent = uf;
            estadoSelect.appendChild(opt);
          }
          estadoSelect.value = uf || estadoSelect.value;
        }
        lockAddressFields();
      } catch {
        unlockAddressFields();
      }
    }
    function lockAddressFields() {
      [enderecoInput, bairroInput, cidadeInput, estadoSelect].forEach(el => {
        if (!el) return;
        el.readOnly = true; el.classList.add('is-readonly');
        if (el.tagName === 'SELECT') el.disabled = true;
      });
    }
    function unlockAddressFields() {
      [enderecoInput, bairroInput, cidadeInput, estadoSelect].forEach(el => {
        if (!el) return;
        el.readOnly = false; el.classList.remove('is-readonly');
        if (el.tagName === 'SELECT') el.disabled = false;
      });
    }

    // Pré-preenche se tiver ?codigo=
    if (codigoParam) {
      const cliente = clients.find(c => String(c.codigo) === String(codigoParam));
      if (cliente) {
        if (codigoInput) codigoInput.value = cliente.codigo;
        if (nomeFantasiaInput) nomeFantasiaInput.value = cliente.nome || '';
        if (razaoSocialInput) razaoSocialInput.value = cliente.nome || '';
        if (cnpjInput) cnpjInput.value = maskCNPJ(cliente.cnpj || '');
        if (redeSelect) {
          const val = cliente.rede || '';
          let has = false;
          Array.from(redeSelect.options).forEach(o => { if (o.textContent.trim().toLowerCase() === val.toLowerCase()) has = true; });
          if (!has && val) {
            const opt = document.createElement('option');
            opt.value = val; opt.textContent = val;
            redeSelect.appendChild(opt);
          }
          redeSelect.value = val || redeSelect.value;
        }
        if (infoAdicionaisText && cliente.infoAdicionais) {
          infoAdicionaisText.value = cliente.infoAdicionais;
        }
        if (statusSelect && cliente.status) {
          statusSelect.value = cliente.status;
        }
      }
    }

    // Salvar (simulação)
    let isFormDirty = false;
    clienteForm.addEventListener('input', () => { isFormDirty = true; });

    clienteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const codigo = (codigoInput?.value || '').trim();
      if (!codigo) { alert('Informe o codigo do cliente.'); return; }

      const idx = clients.findIndex(c => String(c.codigo) === String(codigo));
      const updated = {
        codigo: Number(codigo),
        nome: (nomeFantasiaInput?.value || razaoSocialInput?.value || '').trim(),
        cnpj: cnpjInput?.value || '',
        rede: redeSelect?.value || '',
        infoAdicionais: (infoAdicionaisText?.value || '').trim(),
        status: (statusSelect?.value || (clients[idx]?.status ?? 'Ativo'))
      };

      if (idx >= 0) clients[idx] = { ...clients[idx], ...updated };
      else clients.push(updated);

      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
      isFormDirty = false;
      alert('Cliente salvo com sucesso!');
      // window.location.href = 'clientes.html'; // se quiser voltar
    });

    window.addEventListener('beforeunload', (event) => {
      if (isFormDirty) { event.preventDefault(); event.returnValue = ''; }
    });

    // Modal "Nova Rede"
    const addRedeBtn = document.getElementById('addRedeBtn');
    const addRedeModalOverlay = document.getElementById('addRedeModalOverlay');
    if (addRedeBtn && addRedeModalOverlay) {
      const closeRedeModalBtn = document.getElementById('closeRedeModalBtn');
      const cancelRedeModalBtn = document.getElementById('cancelRedeModalBtn');
      const addRedeForm = document.getElementById('addRedeForm');
      const newRedeNameInput = document.getElementById('newRedeName');

      const openRedeModal = () => addRedeModalOverlay.classList.add('visible');
      const closeRedeModal = () => addRedeModalOverlay.classList.remove('visible');

      addRedeBtn.addEventListener('click', openRedeModal);
      closeRedeModalBtn.addEventListener('click', closeRedeModal);
      cancelRedeModalBtn.addEventListener('click', closeRedeModal);
      addRedeModalOverlay.addEventListener('click', (event) => { if (event.target === addRedeModalOverlay) closeRedeModal(); });

      addRedeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRedeName = newRedeNameInput.value.trim();
        if (newRedeName) {
          const opt = document.createElement('option');
          opt.value = newRedeName; opt.textContent = newRedeName;
          redeSelect.appendChild(opt);
          opt.selected = true;
          alert(`Rede "${newRedeName}" adicionada com sucesso!`);
          newRedeNameInput.value = '';
          closeRedeModal();
        }
      });
    }

    // Modal "Acessos" (com coluna Senha) — cadastro dentro do formulário
    const openAccessModalBtn = document.getElementById('openAccessModalBtn');
    const accessModalOverlay = document.getElementById('accessModalOverlay');
    if (openAccessModalBtn && accessModalOverlay) {
      const closeAccessModalBtn = document.getElementById('closeAccessModalBtn');
      const cancelAccessModalBtn = document.getElementById('cancelAccessModalBtn');
      const accessForm = document.getElementById('accessForm');
      const accessTableBody = document.getElementById('accessTableBody');
      const noAccessMessageRow = document.getElementById('noAccessMessageRow');

      const openModal = () => accessModalOverlay.classList.add('visible');
      const closeModal = () => { accessModalOverlay.classList.remove('visible'); accessForm.reset(); };

      if (accessTableBody.querySelectorAll('.access-row').length === 0) {
        if (noAccessMessageRow) noAccessMessageRow.style.display = 'table-row';
      } else {
        if (noAccessMessageRow) noAccessMessageRow.style.display = 'none';
      }

      openAccessModalBtn.addEventListener('click', openModal);
      closeAccessModalBtn.addEventListener('click', closeModal);
      cancelAccessModalBtn.addEventListener('click', closeModal);
      accessModalOverlay.addEventListener('click', (event) => { if (event.target === accessModalOverlay) closeModal(); });

      accessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const estacao = document.getElementById('estacao').value;
        const tipoAcesso = document.getElementById('tipoAcesso').value;
        const acessoId = document.getElementById('acessoId').value;
        const acessoUsuario = document.getElementById('acessoUsuario').value;
        const acessoSenha = document.getElementById('acessoSenha').value;
        const codigo = (codigoInput?.value || '').trim();
        if (!codigo) { alert('Informe/salve o codigo do cliente para registrar acessos.'); return; }

        const key = ACCESS_PREFIX + codigo;
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        current.push({estacao, tipo: tipoAcesso, id: acessoId, usuario: acessoUsuario, senha: acessoSenha});
        localStorage.setItem(key, JSON.stringify(current));

        const newRow = document.createElement('tr');
        newRow.classList.add('access-row');
        newRow.innerHTML = `
          <td>${estacao || '-'}</td>
          <td>${tipoAcesso || '-'}</td>
          <td>${acessoId || '-'}</td>
          <td>${acessoUsuario || '-'}</td>
          <td>${acessoSenha || '-'}</td>
          <td class="actions">
            <button class="action-btn" title="Editar"><i class="ph ph-pencil-simple"></i></button>
            <button class="action-btn btn-danger" title="Excluir"><i class="ph ph-trash"></i></button>
          </td>
        `;
        accessTableBody.appendChild(newRow);
        if (noAccessMessageRow) noAccessMessageRow.style.display = 'none';
        closeModal();
      });
    }
  }
});
