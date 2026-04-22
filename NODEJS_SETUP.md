# Node.js & npm Setup Guide for LP_AI

## ✅ Installation Complete

Node.js and npm have been successfully installed and your frontend has been built.

---

## System Information

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | v25.9.0 | ✅ Installed |
| npm | v11.12.1 | ✅ Installed |
| Vite | v7.3.1 | ✅ Ready |
| Frontend Build | Latest | ✅ Complete |

---

## Installation Paths

- **Node.js**: `C:\Program Files\nodejs\`
- **Project**: `F:\My projects\Life-Pilot-AI\LP_AI\LP_AI\`
- **Build Output**: `public/build/`

---

## Quick Start

### Using Batch File (Windows Command Prompt)
```batch
npm-helper.bat run build
npm-helper.bat install
npm-helper.bat run dev
npm-helper.bat audit fix
```

### Using PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser  # Run this once
.\npm-helper.ps1 run build
.\npm-helper.ps1 install
.\npm-helper.ps1 run dev
.\npm-helper.ps1 audit fix
```

### Direct npm Commands
If you have Node.js in PATH (usually after system restart):
```powershell
npm run build
npm install
npm run dev
npm audit fix
```

---

## Available npm Scripts

From [package.json](package.json):

```bash
npm run build       # Build frontend for production (Vite)
npm install         # Install/update dependencies
npm run dev         # Start development server with hot reload
npm audit           # Check for vulnerabilities
npm audit fix       # Auto-fix security vulnerabilities
```

---

## Build Output

After running `npm run build`, the following files are generated:

```
public/build/
├── manifest.json                 # Asset manifest
└── assets/
    ├── app-DUC1_6xF.css         # Compiled CSS (36.01 KB)
    └── app-CKl8NZMC.js          # Compiled JavaScript (36.69 KB)
```

---

## Security Notes

### Vulnerabilities Found: 6
- 2 moderate vulnerabilities
- 4 high vulnerabilities

### Fix Vulnerabilities
```bash
npm audit fix
# Or use helper script:
npm-helper.bat audit fix
```

---

## Environment Setup

### Permanent PATH Setup (Optional)

To use `npm` command globally without the helper script:

1. Open Environment Variables:
   - Search "Environment Variables" in Windows
   - Click "Edit the system environment variables"

2. Click "Environment Variables" button

3. Under "System variables", select "Path" and click "Edit"

4. Click "New" and add: `C:\Program Files\nodejs`

5. Click "OK" and restart your terminal/IDE

### Or use the Helper Scripts

We've provided two helper scripts to automatically set up the environment:

- **npm-helper.bat** - For Command Prompt
- **npm-helper.ps1** - For PowerShell

---

## Troubleshooting

### "npm is not recognized"
**Solution**: Use the helper scripts provided or add Node.js to your system PATH.

### "node is not recognized"
**Solution**: Same as above - restart terminal or use helper script.

### Build fails with "vite build error"
**Solution**: 
```bash
npm install
npm run build
```

### High vulnerabilities in npm audit
**Solution**:
```bash
npm audit fix --force
```

---

## Next Steps

1. ✅ Node.js installed
2. ✅ npm dependencies ready
3. ✅ Frontend built (production-ready)
4. ⏳ Start Laravel server: `php artisan serve`
5. ⏳ Access application: `http://localhost:8000`

---

## Development Workflow

### For Development (with hot reload)
```bash
npm-helper.bat run dev
# In another terminal:
php artisan serve
```

### For Production
```bash
npm-helper.bat run build
npm-helper.bat audit fix
# Then start Laravel:
php artisan serve
```

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Laravel Vite Guide](https://laravel.com/docs/vite)

---

**Setup Date**: April 23, 2026
**Status**: ✅ COMPLETE
