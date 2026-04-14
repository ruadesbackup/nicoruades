require('dotenv').config();

const app = require('./app');
const { PORT } = require('./config/environment');

app.listen(PORT, () => {
	console.log(`Servidor escuchando en puerto ${PORT}`);
});
