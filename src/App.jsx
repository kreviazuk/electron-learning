import React from 'react';
import { createRoot } from 'react-dom/client';
import NotebookApp from './components/NotebookApp';
import './styles.css';

function App() {
  return <NotebookApp />;
}

// 渲染应用
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 