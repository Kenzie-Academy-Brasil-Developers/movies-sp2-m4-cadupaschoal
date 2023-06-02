import { create, erase, read, retrieve, update } from './logics';
import express, { Application } from 'express';
import { startDatabase } from './database';
import { verifyIfExists, verifyIfIdExists } from './middlewares';

const app: Application = express();
app.use(express.json());

const PORT: number = 3000;
const runningMsg: string = `Server is running on port ${PORT}`;
app.post('/movies', verifyIfExists, create);
app.get('/movies', retrieve);
app.use('/movies/:id', verifyIfIdExists);
app.get('/movies/:id', read);
app.patch('/movies/:id', verifyIfExists, update);
app.delete('/movies/:id', erase);

app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
