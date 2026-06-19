import app from './app';

const PORT = process.env.PORT || 3333;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 SUH Backend running on http://localhost:${PORT}`);
  });
}

export default app;
