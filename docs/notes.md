## Debug
1. 
```bash
consola: node debug
```
2. 
```chrome
chrome://inspect
```
3. ir a Open dedicated DevTools for Node
4. Colocar breakpoints

# Cerrar server por consola
- Linux: Si no cierra, entonces sudo fuser -k 3000/tcp
- Windows: netstat -ano | findstr :3000 + taskkill /PID "numero" /F

