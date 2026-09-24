# 📱 NeuroScan Mobile — Aplicativo Expo & React Native

![React Native](https://img.shields.io/badge/React_Native-0.79-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-53.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-443e38?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-Offline_First-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Aplicativo móvel multiplataforma (**Android, iOS e Web**) desenvolvido com **React Native** e **Expo SDK 53** para aplicação de questionários clínicos, testes psicomotores e captura de telemetria de sensores inerciais em tempo real.

---

## 📌 Funcionalidades

- 📱 **Interface Mobile Moderna:** Navegação fluida baseada em rotas com **Expo Router** e abas inferiores customizadas.
- 📡 **Coleta de Sensores Inerciais:** Leitura contínua de **Acelerômetro** e **Giroscópio** via `expo-sensors` durante o preenchimento dos testes.
- 💾 **Persistência Offline-First:** Armazenamento local com `expo-sqlite` para garantia de integridade dos dados mesmo sem conexão.
- 📈 **Visualização Gráfica:** Gráficos interativos com `react-native-gifted-charts` para feedback imediato das coletas.
- ⚡ **Gerenciamento de Estado Global:** Fluxo de dados performático e desacoplado utilizando **Zustand**.
- 🐳 **Build Web Containerizado:** Suporte para deploy web em container Docker com proxy reverso Nginx.

---

## 🏗️ Estrutura do Projeto

```text
neuroscan-teste/
├── app/                  # Rotas, telas e layout (Expo Router)
├── assets/               # Imagens, ícones e fontes customizadas
├── components/           # Componentes visuais reutilizáveis
├── lib/                  # Utilitários, conexões com banco e helpers
├── app.config.ts         # Configurações dinâmicas do Expo
├── docker-compose.yml    # Orquestração do build web
├── Dockerfile            # Container multi-stage para web
├── nginx.conf            # Configuração do servidor Web Nginx
└── package.json
```

---

## 🛠️ Tecnologias Utilizadas

- **Core:** [React Native 0.79](https://reactnative.dev/) & [Expo SDK 53](https://expo.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Sensores:** `expo-sensors` (Acelerômetro e Giroscópio)
- **Persistência Local:** `expo-sqlite`
- **Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Formulários:** React Hook Form
- **Gráficos:** `react-native-gifted-charts` & `react-native-svg`
- **Ambiente Web:** Docker & Nginx

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v20+)
- Aplicativo **Expo Go** no smartphone (disponível no Google Play / App Store) ou emulador Android/iOS configurado

### 1. Clonar o repositório
```bash
git clone https://github.com/douglasmeneses/neuroscan-teste.git
cd neuroscan-teste
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Iniciar o servidor Expo
```bash
npx expo start
```

- Pressione `a` para abrir no emulador Android.
- Pressione `i` para abrir no simulador iOS.
- Pressione `w` para abrir a versão Web no navegador.
- Ou escaneie o QR Code exibido no terminal com o app **Expo Go**.

### 4. Executar via Docker (Web)
```bash
docker compose up -d
```
Acesse a versão web em `http://localhost:80` (ou na porta mapeada no `docker-compose.yml`).

---

## 👨‍💻 Autor

Desenvolvido por **Douglas Meneses**.

- 💼 GitHub: [@douglasmeneses](https://github.com/douglasmeneses)
- ✉️ Email: [meneses.doug@gmail.com](mailto:meneses.doug@gmail.com)
