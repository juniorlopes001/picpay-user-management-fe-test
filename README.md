# Caros avaliadores, obrigado pela oportunidade de participar desse desafio técnico para o time de Data e Machine Learning do Picpay (=

Solução desenvolvida para o desafio técnico do PicPay. O foco aqui foi criar uma aplicação **pronta para produção**, utilizando os recursos mais modernos do Angular 16+ sem introduzir complexidade acidental.

A filosofia adotada foi: **Manutenibilidade > Complexidade**.

##  Tech Stack & Ferramentas

* **Core:** Angular 16 (Standalone Components)
* **Linguagem:** TypeScript Strict Mode
* **Estilo:** SCSS (Modularizado)
* **Dados:** RxJS & HttpClient
* **Forms:** Typed Reactive Forms
* 
**Mock API:** JSON Server 



---

##  Setup da aplicação

Para rodar o projeto localmente, você precisará de dois terminais (um para a API e outro para o Front).

**1. Instalação**

```bash
npm install

```

**2. Rodar a API Fake (Porta 3000)**

```bash
npm run api

```

**3. Rodar a Aplicação (Porta 4200)**

```bash
npm start

```

**4. Rodar Testes**

```bash
npm test

```

---

## Decisões Arquiteturais

Abaixo, explico brevemente as escolhas técnicas para atender aos requisitos de escalabilidade e organização.

Suponhamos que essa seja uma aplicação produtiva...

### 1. Standalone Components (Modern Angular)

Abandonei completamente o `NgModule`. O projeto utiliza **Standalone Components**, o que reduz boilerplate, facilita o *tree-shaking* e simplifica a curva de aprendizado para novos desenvolvedores que entrarem no projeto.

### 2. State Management: Service-as-a-Store

Para um CRUD, utilizar Redux (NgRx) seria *overengineering*..
Optei pelo padrão **Service-as-a-Store** com `BehaviorSubject`:

* **Single Source of Truth:** O componente não guarda dados, ele apenas reflete o estado do Service.
* **Reatividade:** A lista é consumida via `users$` com `AsyncPipe`, eliminando *memory leaks* de subscriptions manuais.
* **Performance:** Atualizações otimistas ou locais evitam *refetchs* desnecessários na API.

Pela falta de conhecimento em signal e novas features do angular, optei pelo velho obsvables/subjects.

### 3. Smart vs. Dumb Components

A separação de responsabilidades foi estrita:

* **`UsersContainer` (Smart):** Orquestra os dados. Injeta o serviço, gerencia os fluxos do RxJS e passa dados para baixo.
* **`UsersList` / `UserForm` (Dumb):** Puramente visuais. Recebem dados via `@Input` e notificam ações via `@Output`. Utilizam `ChangeDetectionStrategy.OnPush` para alta performance de renderização.

### 4. RxJS & Data Fetching

Nada de `subscribe` dentro dos componentes para leitura de dados.

* Utilizei pipes como `switchMap` para evitar *race conditions* na busca.
* 
`debounceTime` e `distinctUntilChanged` foram aplicados no filtro de pesquisa para evitar spam de requisições.



### 5. UX & Feedback

* **Loading Centralizado:** Um `Interceptor` captura todas as requisições HTTP para gerenciar o estado de loading globalmente, sem sujar os componentes com booleanos de `isLoading`.
* 
**Tratamento de Erros:** Um interceptor global captura falhas HTTP e exibe notificações amigáveis (Toast/Snackbar).



---

##  Estrutura de Pastas

Organização baseada em **features** (domínio), não em tipos de arquivo. Isso facilita a escalabilidade: se a feature "Users" for removida, tudo vai junto.

```text
src/app/
 ├── core/              # Singletons (Interceptors, Services globais)
 ├── shared/            # UI Kit reutilizável (Loaders, Dialogs)
 └── features/
     └── users/         # Módulo isolado de usuários
         ├── components/    # Dumb Components
         ├── services/      # Lógica de Estado e API
         ├── pages/         # Smart Components (Roteamento)
         └── models/        # Interfaces estritas

```

---

## Estratégia de Testes

Foquei em testes que garantem a confiabilidade do negócio, não apenas cobertura de linhas:

1. **Services:** Validam se o estado (`BehaviorSubject`) é atualizado corretamente após o retorno da API.
2. **Componentes:** Validam se os `@Output` são emitidos corretamente ao clicar em botões críticos (Excluir/Editar).