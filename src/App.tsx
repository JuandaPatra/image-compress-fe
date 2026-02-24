import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ConvertPage from './pages/ConvertPage';
import CompressPage from './pages/CompressPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/convert" replace />} />
          <Route path="convert" element={<ConvertPage />} />
          <Route path="compress" element={<CompressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
