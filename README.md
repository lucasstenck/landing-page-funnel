# Landing Page - Funil de Vendas

Projeto de landing page com funil de vendas para produtos de dieta.

## Visão Geral

O projeto consiste em três páginas principais:
1. **Landing Page** - Página de vendas com captura de leads
2. **Página de Cadastro/Login** - Sistema de autenticação
3. **Área de Membros** - Conteúdo exclusivo para usuários logados

## Funcionalidades

- Design responsivo
- Captura automática de leads
- Sistema de login/registro
- Área de membros com conteúdo exclusivo
- Analytics e tracking
- Notificações em tempo real

## Como Usar

```bash
npm start
```

Acesse: `http://localhost:3000`

## Estrutura

```
landing-page/
├── index.html          # Landing page
├── cadastro.html       # Login/registro
├── membros.html        # Área de membros
├── css/                # Estilos
├── js/                 # JavaScript
└── database/           # Backend MySQL
```

## Configuração

### MySQL
- Host: `localhost`
- Username: `dietatransform_user`
- Password: `DietaTransform2024!`

Execute os scripts SQL:
- `database/users_db.sql`
- `database/leads_db.sql` 