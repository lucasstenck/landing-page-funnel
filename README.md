# Landing Page - Funil de Vendas

Este projeto implementa um funil de vendas completo para produtos de dieta, desenvolvido para fins de prática e aprendizado.

## Visão Geral

O projeto consiste em três páginas principais que formam um funil de vendas:

1. **Landing Page** - Página de vendas com captura de leads
2. **Página de Cadastro/Login** - Sistema de autenticação
3. **Área de Membros** - Conteúdo exclusivo para usuários logados

## Funcionalidades

### Landing Page (index.html)
- Design moderno e responsivo
- Captura automática de leads após 1 minuto
- Modal de captura com formulário
- Seções: Hero, Benefícios, Depoimentos, Garantia
- Call-to-action para redirecionamento
- Sistema de analytics integrado
- Notificações em tempo real

### Página de Cadastro (cadastro.html)
- Sistema de login e registro
- Validação de senha em tempo real
- Toggle de visibilidade da senha
- Armazenamento local de usuários
- Redirecionamento automático após login
- Tracking de conversões
- Notificações de boas-vindas

### Área de Membros (membros.html)
- Verificação de autenticação
- Dashboard de progresso do usuário
- Cursos em vídeo com modal
- Download de materiais complementares
- Sistema de progresso avançado
- Menu do usuário com logout
- Sistema de conquistas e recompensas
- Tracking de atividades

## Tecnologias Utilizadas

- HTML5 - Estrutura semântica
- CSS3 - Estilos modernos com Flexbox e Grid
- JavaScript ES6+ - Funcionalidades interativas
- Font Awesome - Ícones
- Google Fonts - Tipografia (Inter)

## Estrutura do Projeto

```
landing-page/
├── index.html              # Landing page principal
├── cadastro.html           # Página de login/registro
├── membros.html            # Área de membros
├── css/
│   ├── style.css           # Estilos globais
│   ├── cadastro.css        # Estilos da página de cadastro
│   └── membros.css         # Estilos da área de membros
├── js/
│   ├── analytics.js        # Sistema de analytics e tracking
│   ├── notifications.js    # Sistema de notificações
│   ├── progress.js         # Sistema de progresso avançado
│   ├── script.js           # JavaScript da landing page
│   ├── cadastro.js         # JavaScript do cadastro
│   └── membros.js          # JavaScript da área de membros
├── database/               # Backend e banco de dados
│   ├── config.php          # Configuração do banco
│   ├── users_manager.php   # Gerenciamento de usuários
│   ├── leads_manager.php   # Gerenciamento de leads
│   ├── users_db.sql        # Script do banco de usuários
│   └── leads_db.sql        # Script do banco de leads
└── images/                 # Imagens do projeto
```

## Como Usar

### 1. Iniciar o Servidor
```bash
# Navegue até a pasta do projeto
cd landing-page

# Inicie o servidor
npm start
```

### 2. Acessar o Projeto
**URL Principal:** `http://localhost:3000`

### 3. Testar o Funil
1. **Landing Page**: Acesse `http://localhost:3000/index.html`
2. **Captura de Leads**: Aguarde 1 minuto para ver o modal
3. **Cadastro**: Clique em "QUERO TRANSFORMAR MINHA VIDA"
4. **Login**: Crie uma conta ou faça login
5. **Área de Membros**: Acesse o conteúdo exclusivo

### 4. URLs Importantes
- **Landing Page:** `http://localhost:3000/index.html`
- **Cadastro/Login:** `http://localhost:3000/cadastro.html`
- **Área de Membros:** `http://localhost:3000/membros.html`

## Configuração do Banco de Dados

### MySQL
- Host: `localhost`
- Port: `3306`
- Username: `dietatransform_user`
- Password: `DietaTransform2024!`

### Bancos de Dados
1. **users_database** - Armazena dados de usuários registrados
2. **leads_database** - Armazena leads capturados na landing page

### Scripts SQL
Execute os scripts na ordem:
- `database/users_db.sql` - Criar banco de usuários
- `database/leads_db.sql` - Criar banco de leads

## Design System

### Cores Principais
- Primária: `#667eea` (Azul)
- Secundária: `#764ba2` (Roxo)
- Sucesso: `#4ade80` (Verde)
- Texto: `#1e293b` (Cinza escuro)

### Tipografia
- Fonte: Inter (Google Fonts)
- Pesos: 300, 400, 500, 600, 700

## Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Armazenamento Local

O projeto utiliza localStorage para:
- Capturas de leads
- Dados de usuários
- Progresso do usuário
- Configurações de analytics

## Funcionalidades de Desenvolvimento

### Console Commands
```javascript
// Exportar dados capturados
exportCaptures()

// Limpar dados capturados
clearCaptures()

// Exportar usuários cadastrados
exportUsers()

// Limpar usuários
clearUsers()

// Resetar progresso (área de membros)
resetProgress()

// Analytics
window.analytics.exportData()
window.analytics.getStats()

// Progresso
window.progress.exportProgressData()
window.progress.getProgressStats()

// Notificações
window.notifications.showNotification('Título', 'Mensagem', 'success')
```

## Fluxo do Funil

```
Landing Page (index.html)
    ↓ (2 minutos)
Modal de Captura
    ↓ (Submit)
Dados salvos no localStorage
    ↓ (CTA Button)
Página de Cadastro (cadastro.html)
    ↓ (Login/Registro)
Área de Membros (membros.html)
    ↓ (Conteúdo Exclusivo)
Vídeos e Materiais
```

## Segurança

### Implementações Atuais
- Validação de formulários
- Verificação de autenticação
- Proteção de rotas
- Armazenamento seguro no localStorage

### Para Produção
- Implementar HTTPS
- Adicionar validação server-side
- Implementar banco de dados real
- Adicionar criptografia de senhas

## Próximos Passos

### Funcionalidades Avançadas
- Sistema de pagamentos
- Email marketing automatizado
- Chat em tempo real
- Sistema de gamificação avançado
- Integração com redes sociais
- App mobile (React Native)

## Contribuição

Este é um projeto de prática e aprendizado. Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Abrir um Pull Request

## Licença

Este projeto é para fins educacionais e de prática. 