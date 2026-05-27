document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------
  // Permissão do usuário logado (mock)
  // Salve algo como {"permission":"admin"} após o login real:
  // localStorage.setItem('vt_current_user', JSON.stringify({ permission: 'admin' }))
  // ----------------------------------------------
  const currentUser = JSON.parse(localStorage.getItem('vt_current_user') || '{"permission":"admin"}');
  const isAdmin = currentUser.permission === 'admin';

  // Elementos principais
  const openModalBtn   = document.getElementById('openModalBtn');
  const usersTableBody = document.getElementById('usersTableBody');

  // Modal Usuário (criar/editar)
  const userModalOverlay = document.getElementById('userModalOverlay');
  const modalTitle       = document.getElementById('modalTitle');
  const modalCloseBtn    = document.getElementById('modalCloseBtn');
  const modalCancelBtn   = document.getElementById('modalCancelBtn');
  const userForm         = document.getElementById('userForm');
  const saveUserBtn      = document.getElementById('saveUserBtn');

  const userIdInput      = document.getElementById('userId');
  const userNameInput    = document.getElementById('userName');
  const userEmailInput   = document.getElementById('userEmail');
  const userPermissionSelect = document.getElementById('userPermission');
  const statusGroup      = document.getElementById('statusGroup');
  const userStatusSelect = document.getElementById('userStatus');
  const passwordGroup    = document.getElementById('passwordGroup');
  const userPasswordInput = document.getElementById('userPassword');

  // Modal Alterar Senha
  const passwordModalOverlay = document.getElementById('passwordModalOverlay');
  const passwordModalTitle   = document.getElementById('passwordModalTitle');
  const passwordCloseBtn     = document.getElementById('passwordCloseBtn');
  const passwordCancelBtn    = document.getElementById('passwordCancelBtn');
  const passwordForm         = document.getElementById('passwordForm');
  const passwordUserId       = document.getElementById('passwordUserId');
  const newPasswordInput     = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  // Estado em memória
  const state = {
    users: Array.from(usersTableBody.querySelectorAll('tr')).map(tr => ({
      id: tr.dataset.id || tr.dataset.email,
      name: tr.dataset.name,
      email: tr.dataset.email,
      permission: tr.dataset.permission,
      status: tr.dataset.status
    }))
  };

  // Utilitários UI
  const openUserModal = () => userModalOverlay.classList.add('visible');
  const closeUserModal = () => userModalOverlay.classList.remove('visible');
  const openPasswordModal = (user) => {
    passwordUserId.value = user.id;
    passwordModalTitle.textContent = `Alterar Senha — ${user.name}`;
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    passwordModalOverlay.classList.add('visible');
  };
  const closePasswordModal = () => passwordModalOverlay.classList.remove('visible');

  // Helpers para render
  function rolePill(permission) {
    switch (permission) {
      case 'admin':     return '<span class="role role--admin">Administrador</span>';
      case 'suporte':   return '<span class="role role--suporte">Suporte</span>';
      case 'comercial': return '<span class="role role--comercial">Comercial</span>';
      default:          return permission;
    }
  }
  function statusPill(status) {
    return status === 'ativo'
      ? '<span class="status status--ativo">Ativo</span>'
      : '<span class="status status--inativo">Inativo</span>';
  }
  function actionsHtml() {
    if (!isAdmin) return '';
    return `
      <button class="btn btn-secondary" data-action="edit"><i class="ph ph-pencil-simple"></i> Editar</button>
      <button class="btn btn-secondary" data-action="password"><i class="ph ph-key"></i> Alterar Senha</button>
      <button class="btn btn-danger" data-action="delete"><i class="ph ph-trash"></i> Excluir</button>
    `;
  }

  // Re-renderiza a linha no DOM a partir do estado
  function renderRow(user) {
    let row = usersTableBody.querySelector(`tr[data-id="${user.id}"]`);
    if (!row) {
      row = document.createElement('tr');
      row.dataset.id = user.id;
      usersTableBody.appendChild(row);
    }
    row.dataset.name = user.name;
    row.dataset.email = user.email;
    row.dataset.permission = user.permission;
    row.dataset.status = user.status;

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${rolePill(user.permission)}</td>
      <td>${statusPill(user.status)}</td>
      <td class="actions">${actionsHtml()}</td>
    `;
  }

  // Render inicial (garante ações certas conforme permissão)
  state.users.forEach(renderRow);

  // Se quiser bloquear "Novo Usuário" para não-admin, descomente:
  // if (!isAdmin) {
  //   openModalBtn?.classList.add('is-disabled');
  //   openModalBtn?.setAttribute('disabled', 'disabled');
  // }

  // ------- Modal Usuário: Novo -------
  function setupNewUserModal() {
    modalTitle.textContent = 'Novo Usuário';
    userIdInput.value = '';
    userNameInput.value = '';
    userEmailInput.value = '';
    userPermissionSelect.value = 'suporte';
    userStatusSelect.value = 'ativo';

    // novo: mostra senha, esconde status
    passwordGroup.style.display = 'block';
    userPasswordInput.required = true;
    statusGroup.style.display = 'none';

    openUserModal();
  }

  // ------- Modal Usuário: Editar -------
  function setupEditUserModal(user) {
    modalTitle.textContent = 'Editar Usuário';
    userIdInput.value = user.id;
    userNameInput.value = user.name;
    userEmailInput.value = user.email;
    userPermissionSelect.value = user.permission;
    userStatusSelect.value = user.status;

    // edição: esconde senha, mostra status
    passwordGroup.style.display = 'none';
    userPasswordInput.required = false;
    statusGroup.style.display = 'block';

    openUserModal();
  }

  // Ações da toolbar
  openModalBtn?.addEventListener('click', () => {
    // Se quiser permitir só admin criar:
    // if (!isAdmin) return;
    setupNewUserModal();
  });
  modalCloseBtn.addEventListener('click', closeUserModal);
  modalCancelBtn.addEventListener('click', closeUserModal);

  // Submit do formulário de usuário (criar/editar)
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const payload = {
      id: userIdInput.value || userEmailInput.value.trim().toLowerCase(),
      name: userNameInput.value.trim(),
      email: userEmailInput.value.trim().toLowerCase(),
      permission: userPermissionSelect.value,
      status: userStatusSelect.value || 'ativo'
    };

    if (modalTitle.textContent.startsWith('Novo')) {
      // Aqui chamaria o backend p/ criar usuário e senha inicial (userPasswordInput.value).
      // Simulação: apenas adiciona no estado/DOM.
      state.users.push(payload);
      renderRow(payload);
      alert('Usuário criado com sucesso! (simulação)');
    } else {
      // Editar
      const idx = state.users.findIndex(u => u.id === userIdInput.value);
      if (idx >= 0) {
        state.users[idx] = { ...state.users[idx], ...payload };
        renderRow(state.users[idx]);
        alert('Usuário atualizado com sucesso! (simulação)');
      }
    }

    closeUserModal();
  });

  // Delegação de cliques nas ações da tabela
  usersTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    // Somente admin pode agir
    if (!isAdmin) return;

    const action = btn.dataset.action;
    const row = btn.closest('tr');
    const id = row?.dataset.id;
    const user = state.users.find(u => u.id === id);
    if (!user) return;

    if (action === 'edit') {
      setupEditUserModal(user);
    } else if (action === 'password') {
      openPasswordModal(user);
    } else if (action === 'delete') {
      const ok = confirm(`Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`);
      if (!ok) return;
      // Simula exclusão
      state.users = state.users.filter(u => u.id !== user.id);
      row.remove();
      alert('Usuário excluído. (simulação)');
    }
  });

  // Modal Alterar Senha
  passwordCloseBtn.addEventListener('click', closePasswordModal);
  passwordCancelBtn.addEventListener('click', closePasswordModal);

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const uid = passwordUserId.value;
    const user = state.users.find(u => u.id === uid);
    if (!user) return;

    const pwd1 = newPasswordInput.value.trim();
    const pwd2 = confirmPasswordInput.value.trim();

    if (pwd1.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (pwd1 !== pwd2) {
      alert('As senhas não conferem.');
      return;
    }

    // Aqui você chamaria o backend para efetivar a troca de senha.
    // Ex.: await api.users.resetPassword({ userId: uid, newPassword: pwd1 })
    alert(`Senha de "${user.name}" alterada com sucesso! (simulação)`);
    closePasswordModal();
  });
});
