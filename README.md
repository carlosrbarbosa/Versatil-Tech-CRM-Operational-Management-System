# Versátil Tech CRM — Operational Management System

![Status](https://img.shields.io/badge/Status-Demo_Online-success?style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Uma solução corporativa completa de **CRM e Gestão de Tickets (Helpdesk)**, desenvolvida para otimizar o fluxo de suporte técnico, organizar o atendimento a clientes e gerir credenciais de acesso remoto com máxima eficiência.

🔗 **[Aceder à Demonstração ao Vivo (Netlify)](https://crm-operational-versatil.netlify.app/)**

> ** Arquitetura do Projeto:** Este repositório público contém a **camada de interface (Frontend)**, preenchida com dados fictícios exclusivamente para fins de demonstração e portfólio. O motor real da aplicação — incluindo a API RESTful desenvolvida em **PHP/Laravel**, as regras de negócio e a base de dados **MySQL** — encontra-se num repositório privado para proteção de propriedade intelectual.

---

## 🔐 Acesso ao Ambiente de Teste
Para explorar a interface de forma interativa, utilize as credenciais de demonstração abaixo:

- **E-mail:** `visitante@versatil.demo`
- **Senha:** `demo123`

---

## 🎯 Principais Funcionalidades

### 📈 Dashboard Analítico
- Visão geral rápida dos KPIs operacionais (Tickets Abertos, Em Andamento e Concluídos).
- Integração com **Chart.js** para visualização de dados em tempo real, incluindo o volume semanal de chamados e a distribuição de carga por estado.

### 🎫 Gestão de Tickets de Suporte
- Listagem inteligente de chamados com categorização por **Prioridade** (Baixa, Média, Alta, Crítica) e **Estado**.
- Formulário detalhado de tickets com upload de anexos, histórico de notas e vinculação automática de clientes.
- Sistema de filtros combinados e exportação rápida de relatórios para Excel.

### 👥 Gestão de Clientes e Acessos
- Registo estruturado de clientes, matrizes e filiais (Redes).
- **Módulo de Acessos Remotos:** Tabela dedicada e segura para armazenar credenciais de acesso às máquinas dos clientes (AnyDesk, TeamViewer, RDP), essencial para o fluxo de suporte de TI.

### 📚 Base de Conhecimento Integrada
- Plataforma interna para documentação de processos, tutoriais de sistema e manuais fiscais.
- Filtro por tags (Sistema, Fiscal, Hardware) para rápida resolução de problemas repetitivos pela equipa de nível 1.

### 🛡️ Controlo de Utilizadores
- Gestão de equipa com hierarquia de permissões (Administrador, Suporte, Comercial).

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do **Versátil Tech** foi desenhado com foco na escalabilidade, manutenibilidade e separação clara de responsabilidades (Frontend desacoplado do Backend).

### Backend (Repositório Privado)
- **Linguagem:** PHP 12.48.1
- **Framework:** Laravel
- **Base de Dados:** MySQL
- **Arquitetura:** Padrão MVC com API RESTful para comunicação ágil e segura com a interface.

### Frontend (Este Repositório)
- **Estrutura:** HTML5 Semântico
- **Estilização:** CSS3 nativo. Uso avançado de *CSS Grid*, *Flexbox* e *Variáveis CSS* para garantir alta performance e um design 100% responsivo, sem dependência de frameworks pesados (como Bootstrap ou Tailwind).
- **Interatividade:** JavaScript Vanilla (ES6+) para manipulação do DOM e modais.
- **Visualização de Dados:** Chart.js
- **Iconografia:** Phosphor Icons

---

## 👨‍💻 Sobre o Desenvolvedor

**Carlos Rocha Barbosa** | *Desenvolvedor Full Stack & Engenharia de Software* [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/crbarbosa/)

---
📝 *Copyright © 2026 Carlos Rocha Barbosa. Todos os direitos reservados. O uso comercial, cópia ou distribuição deste código-fonte sem autorização expressa é proibido.*
