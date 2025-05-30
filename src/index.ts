import express from 'express';
import identifyRouter from './routes/identify';

const app = express();
app.use(express.json());

app.use('/identify', identifyRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
