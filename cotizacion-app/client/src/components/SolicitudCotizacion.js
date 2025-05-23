import React, { useState } from 'react';
import axios from 'axios';

const SolicitudCotizacion = () => {
    const [formData, setFormData] = useState({
        nombreCliente: '',
        emailCliente: '',
        producto: '',
        descripcion: '',
        cantidad: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/cotizacion', formData);
            setMessage('Solicitud enviada exitosamente. Pronto recibirá una cotización.');
            setFormData({
                nombreCliente: '',
                emailCliente: '',
                producto: '',
                descripcion: '',
                cantidad: ''
            });
        } catch (error) {
            setMessage('Error al enviar la solicitud. Por favor, inténtelo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cotizacion-form">
            <h2>Solicitud de Cotización</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombreCliente"
                        value={formData.nombreCliente}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="emailCliente"
                        value={formData.emailCliente}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Producto:</label>
                    <input
                        type="text"
                        name="producto"
                        value={formData.producto}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        name="cantidad"
                        value={formData.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default SolicitudCotizacion;
