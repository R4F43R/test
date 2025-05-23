import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SolicitudCotizacion from './components/SolicitudCotizacion';
import PanelCotizaciones from './components/PanelCotizaciones';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-link">Solicitar Cotización</Link>
          <Link to="/panel" className="nav-link">Panel de Cotizaciones</Link>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SolicitudCotizacion />} />
            <Route path="/panel" element={<PanelCotizaciones />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
