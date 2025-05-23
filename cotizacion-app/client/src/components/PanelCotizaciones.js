import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PanelCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [total, setTotal] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCotizaciones();
    }, []);

    const fetchCotizaciones = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cotizaciones');
            setCotizaciones(response.data);
        } catch (error) {
            console.error('Error fetching cotizaciones:', error);
        }
    };

    const handleCotizar = async (cotizacion) => {
        setSelectedCotizacion(cotizacion);
        setPrecioUnitario('');
        setTotal('');
    };

    const handleGuardarCotizacion = async () => {
        if (!precioUnitario || !total) return;

        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/cotizacion/${selectedCotizacion._id}`, {
                precioUnitario: parseFloat(precioUnitario),
                total: parseFloat(total)
            });
            setSelectedCotizacion(null);
            setPrecioUnitario('');
            setTotal('');
            await fetchCotizaciones();
        } catch (error) {
            console.error('Error saving cotizacion:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cotizaciones-panel">
            <h2>Panel de Cotizaciones</h2>
            <div className="cotizaciones-list">
                {cotizaciones.map((cotizacion) => (
                    <div
                        key={cotizacion._id}
                        className={`cotizacion-item ${cotizacion.estado}`}
                    >
                        <h3>{cotizacion.producto}</h3>
                        <p>Cliente: {cotizacion.nombreCliente}</p>
                        <p>Cantidad: {cotizacion.cantidad}</p>
                        <p>Estado: {cotizacion.estado}</p>
                        {cotizacion.estado === 'cotizado' && (
                            <div>
                                <p>Precio Unitario: ${cotizacion.precioUnitario}</p>
                                <p>Total: ${cotizacion.total}</p>
                            </div>
                        )}
                        {cotizacion.estado === 'pendiente' && (
                            <button
                                onClick={() => handleCotizar(cotizacion)}
                                className="cotizar-btn"
                            >
                                Cotizar
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {selectedCotizacion && (
                <div className="cotizacion-modal">
                    <h3>Cotizar Producto</h3>
                    <div className="cotizacion-details">
                        <p>Producto: {selectedCotizacion.producto}</p>
                        <p>Cantidad: {selectedCotizacion.cantidad}</p>
                    </div>
                    <div className="pricing-form">
                        <div className="form-group">
                            <label>Precio Unitario:</label>
                            <input
                                type="number"
                                value={precioUnitario}
                                onChange={(e) => setPrecioUnitario(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Total:</label>
                            <input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                required
                            />
                        </div>
                        <div className="modal-buttons">
                            <button
                                onClick={() => {
                                    setSelectedCotizacion(null);
                                    setPrecioUnitario('');
                                    setTotal('');
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardarCotizacion}
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar Cotización'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanelCotizaciones;
