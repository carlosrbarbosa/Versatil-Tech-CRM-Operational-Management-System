/* Tickets – filtros branco/azul, ações funcionais e paginação */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Estado ----
  const STATE = {
    data: [],
    filtered: [],
    page: 1,
    pageSize: 25,
    sortKey: 'id',
    sortDir: 'desc',
    status: '',
    priority: '',
    term: ''
  };

  // ---- Elementos ----
  const tbody = document.getElementById('ticketsBody');
  const emptyState = document.getElementById('emptyState');

  const filterTerm = document.getElementById('filterTerm');

  const btnStatus = document.getElementById('btnStatus');
  const menuStatus = document.getElementById('menuStatus');
  const btnPriority = document.getElementById('btnPriority');
  const menuPriority = document.getElementById('menuPriority');

  const selectAll = document.getElementById('selectAll');

  const rangeInfo = document.getElementById('rangeInfo');
  const totalInfo = document.getElementById('totalInfo');
  const pagesContainer = document.getElementById('pagesContainer');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');

  // ---- Dados fake ----
  const priorities = ['Baixa','Média','Alta','Crítica'];
  const statuses   = ['Aberto','Em Análise com o Dev','Aguardando Próxima Versão','Aguardando Cliente','Concluído'];
  const clientes   = ['Posto São João','Posto Via Norte','Auto Posto Master','Rede Martinelli','Auto Posto Nova Era','Posto Shell'];
  const responsaveis = ['Rafael','Beatriz','Ana','Carlos','Yuri'];
  const rand = (arr) => arr[Math.floor(Math.random()*arr.length)];
  function pad(n){ return n < 10 ? '0'+n : n; }
  function dateStr(yyyy, mm, dd){ return `${pad(dd)}/${pad(mm)}/${yyyy}`; }

  function seed(){
    const out = [];
    let id = 1001;
    const base = new Date(2025, 9, 1); // 01/10/2025
    for(let i=0;i<75;i++){
      const dt = new Date(base.getTime() + i*86400000/2);
      const thisId = id++;
      out.push({
        id: thisId,
        titulo: `Chamado #${i+1} - ${rand(['Atualização Fiscal','Implantação SGA','Configuração SAT','Integração TEF','Migração Banco'])}`,
        cliente: rand(clientes),
        prioridade: rand(priorities),
        status: rand(statuses),
        responsavel: rand(responsaveis),
        abertura: dateStr(dt.getFullYear(), dt.getMonth()+1, dt.getDate()),
        sga: `https://sga.versatil.local/tickets/${thisId}` // link simulado
      });
    }
    return out;
  }

  // ---- Render helpers ----
  function pillPriority(p){
    const map = {
      'Baixa':'pill-prio-baixa','Média':'pill-prio-media','Alta':'pill-prio-alta','Crítica':'pill-prio-critica'
    };
    return `<span class="pill ${map[p]||''}">${p}</span>`;
  }
  function pillStatus(s){
    const key = s.toLowerCase();
    let cls = 'pill-sts-aberto';
    if (key.includes('dev')) cls = 'pill-sts-analise-dev';
    else if (key.includes('próxima') || key.includes('proxima')) cls = 'pill-sts-aguard-versao';
    else if (key.includes('cliente')) cls = 'pill-sts-aguard-cliente';
    else if (key.includes('concl')) cls = 'pill-sts-concluido';
    return `<span class="pill ${cls}">${s}</span>`;
  }

  // ---- Sort ----
  function cmp(a,b,key){
    const va = a[key], vb = b[key];
    if(key==='id'){
      return (va - vb) * (STATE.sortDir==='asc' ? 1 : -1);
    }
    return (''+va).localeCompare((''+vb), 'pt-BR', {sensitivity:'base'}) * (STATE.sortDir==='asc' ? 1 : -1);
  }

  // ---- Filtro + Paginação ----
  function apply(){
    const term = STATE.term.trim().toLowerCase();
    STATE.filtered = STATE.data.filter(t=>{
      const okStatus = !STATE.status || t.status===STATE.status;
      const okPrio   = !STATE.priority || t.prioridade===STATE.priority;
      const hay = `${t.id} ${t.titulo} ${t.cliente}`.toLowerCase();
      const okTerm   = !term || hay.includes(term);
      return okStatus && okPrio && okTerm;
    }).sort((a,b)=>cmp(a,b,STATE.sortKey));

    totalInfo.textContent = STATE.filtered.length;
    STATE.page = Math.min(STATE.page, Math.max(1, Math.ceil(STATE.filtered.length/STATE.pageSize)));
    renderTable();
    renderPagination();
  }

  function renderTable(){
    const start = (STATE.page-1)*STATE.pageSize;
    const end = Math.min(start + STATE.pageSize, STATE.filtered.length);
    const slice = STATE.filtered.slice(start, end);

    rangeInfo.textContent = slice.length ? `Mostrando ${start+1}–${end}` : 'Mostrando 0–0';
    emptyState.hidden = !!slice.length;

    tbody.innerHTML = slice.map(t=>`
      <tr data-id="${t.id}">
        <td><input type="checkbox" class="row-check" data-id="${t.id}" /></td>
        <td><strong>${t.id}</strong></td>
        <td>${t.titulo}</td>
        <td>${t.cliente}</td>
        <td>${pillPriority(t.prioridade)}</td>
        <td>${pillStatus(t.status)}</td>
        <td>${t.responsavel}</td>
        <td>${t.abertura}</td>
        <td class="actions-cell">
          <button class="action-btn btn-edit" title="Editar"><i class="ph ph-pencil-simple"></i></button>
          <button class="action-btn btn-open" title="Ir ao chamado (SGA)"><i class="ph ph-arrow-square-out"></i></button>
          <button class="action-btn btn-danger btn-delete" title="Excluir"><i class="ph ph-trash"></i></button>
        </td>
      </tr>
    `).join('');

    selectAll.checked = false;
    bindRowActions();
  }

  function pageList(total, current){
    const pages = [];
    const windowSize = 2;
    const add = (v)=>pages.push(v);

    add(1);
    const left = Math.max(2, current - windowSize);
    const right = Math.min(total-1, current + windowSize);

    if(left>2) add('…');
    for(let p=left;p<=right;p++) add(p);
    if(right<total-1) add('…');

    if(total>1) add(total);
    return pages;
  }

  function renderPagination(){
    const totalPages = Math.max(1, Math.ceil(STATE.filtered.length/STATE.pageSize));
    pagesContainer.innerHTML = '';
    pageList(totalPages, STATE.page).forEach(p=>{
      if(p==='…'){
        const span = document.createElement('span');
        span.className = 'page-index ellipsis';
        span.textContent = '…';
        pagesContainer.appendChild(span);
      } else {
        const btn = document.createElement('button');
        btn.className = 'page-index' + (p===STATE.page ? ' active' : '');
        btn.textContent = p;
        btn.addEventListener('click', ()=>{ STATE.page = p; renderTable(); renderPagination(); });
        pagesContainer.appendChild(btn);
      }
    });
    prevPage.disabled = STATE.page<=1;
    nextPage.disabled = STATE.page>=totalPages;
  }

  // ---- Ações por linha ----
  function bindRowActions(){
    tbody.querySelectorAll('.btn-edit').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.closest('tr').dataset.id;
        window.location.href = `ticket_formulario.html?ticket=${id}`;
      });
    });

    tbody.querySelectorAll('.btn-open').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = +e.currentTarget.closest('tr').dataset.id;
        const tk = STATE.data.find(t => t.id === id);
        if (tk && tk.sga) window.open(tk.sga, '_blank');
      });
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = +e.currentTarget.closest('tr').dataset.id;
        const ok = confirm(`Tem certeza que deseja excluir o ticket #${id}?\nEssa ação não poderá ser desfeita.`);
        if(!ok) return;
        // remove do dataset principal
        const i = STATE.data.findIndex(t => t.id === id);
        if(i>=0) STATE.data.splice(i,1);
        apply(); // re-render tudo
      });
    });
  }

  // ---- Dropdowns ----
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dd=>{
    const btn = dd.querySelector('.btn');
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      dropdowns.forEach(d=>{ if(d!==dd) d.classList.remove('open'); });
      dd.classList.toggle('open');
    });
  });
  document.addEventListener('click', ()=> dropdowns.forEach(d=>d.classList.remove('open')));

  // Escolha Status
  menuStatus.querySelectorAll('.dropdown-item').forEach(it=>{
    it.addEventListener('click', ()=>{
      STATE.status = it.dataset.value || '';
      btnStatus.querySelector('[data-label]').textContent = `Status: ${STATE.status || 'Todos'}`;
      apply();
    });
  });

  // Escolha Prioridade
  menuPriority.querySelectorAll('.dropdown-item').forEach(it=>{
    it.addEventListener('click', ()=>{
      STATE.priority = it.dataset.value || '';
      btnPriority.querySelector('[data-label]').textContent = `Prioridade: ${STATE.priority || 'Todas'}`;
      apply();
    });
  });

  // Busca
  filterTerm.addEventListener('input', ()=>{
    STATE.term = filterTerm.value;
    STATE.page = 1;
    apply();
  });

  // Sort
  document.querySelectorAll('.data-table thead .sortable').forEach(th=>{
    th.addEventListener('click', ()=>{
      const key = th.dataset.key;
      if(STATE.sortKey===key){
        STATE.sortDir = STATE.sortDir==='asc' ? 'desc' : 'asc';
      } else {
        STATE.sortKey = key;
        STATE.sortDir = 'asc';
      }
      apply();
    });
  });

  // Paginação
  prevPage.addEventListener('click', ()=>{ STATE.page=Math.max(1,STATE.page-1); renderTable(); renderPagination(); });
  nextPage.addEventListener('click', ()=>{
    const totalPages = Math.max(1, Math.ceil(STATE.filtered.length/STATE.pageSize));
    STATE.page=Math.min(totalPages,STATE.page+1); renderTable(); renderPagination();
  });

  // Select all
  selectAll.addEventListener('change', ()=>{
    document.querySelectorAll('.row-check').forEach(cb=> cb.checked = selectAll.checked );
  });

  // Export CSV
  document.getElementById('exportCsv').addEventListener('click', ()=>{
    const headers = ['ID','Título','Cliente','Prioridade','Status','Responsável','Data de Abertura'];
    const rows = STATE.filtered.map(t=>[
      t.id, t.titulo, t.cliente, t.prioridade, t.status, t.responsavel, t.abertura
    ]);
    const csv = [headers, ...rows].map(r=>r.map(val=>{
      const s = (''+val).replace(/"/g,'""');
      return /[",;\n]/.test(s) ? `"${s}"` : s;
    }).join(';')).join('\n');

    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets-versatil.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // ---- Boot ----
  STATE.data = seed();
  apply();
});
