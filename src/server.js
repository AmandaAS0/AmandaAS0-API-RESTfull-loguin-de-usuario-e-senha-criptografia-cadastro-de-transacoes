const app = require('./index')

const port = 3000 || 8000

app.listen(port, () => {
    console.log(`Servidor sendo executado na porta http://localhost:${port}`);
})