# marlins-tracker

Track Miami Marlins games and their affiliate teams in real time

## Tech Stack

- React 19
- Vite 7.0
- TypeScript
- Tailwind
- Shadcn

## Before you Get Started

This project requires Node.js version 20.10.0 or later due to Vite 7.0.0 compatibility. If you encounter the error `TypeError: crypto.hash is not a function`, make sure to upgrade your Node.js version. You can find that issue reported [here](https://github.com/vitejs/vite/issues/20287).

### Check your Node.js version:

```bash
node --version
```

### Install/Upgrade Node.js if needed:

- **macOS**: Use [nvm](https://github.com/nvm-sh/nvm) or download from [nodejs.org](https://nodejs.org/)
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your package manager or [nvm](https://github.com/nvm-sh/nvm)

### Fix for crypto.hash issue above:

```bash
npm install node
sudo npm install n -g
```

## Running the App

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd marlins-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL displayed in the terminal, which should be `http://localhost:5173/marlins-tracker/`.
