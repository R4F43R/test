require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cotizacion-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const CotizacionSchema = new mongoose.Schema({
    nombreCliente: String,
    emailCliente: String,
    producto: String,
    descripcion: String,
    cantidad: Number,
    precioUnitario: Number,
    total: Number,
    estado: {
        type: String,
        enum: ['pendiente', 'cotizado', 'confirmado'],
        default: 'pendiente'
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    }
});

const Cotizacion = mongoose.model('Cotizacion', CotizacionSchema);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.post('/api/cotizacion', async (req, res) => {
    try {
        const { nombreCliente, emailCliente, producto, descripcion, cantidad } = req.body;
        
        // Create cotizacion
        const cotizacion = new Cotizacion({
            nombreCliente,
            emailCliente,
            producto,
            descripcion,
            cantidad,
            estado: 'pendiente'
        });
        
        await cotizacion.save();
        
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emailCliente,
            subject: 'Solicitud de Cotización Recibida',
            html: `
                <h2>Gracias por su solicitud de cotización</h2>
                <p>Hemos recibido su solicitud para el producto: ${producto}</p>
                <p>Pronto recibirá una cotización detallada.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(201).json({ message: 'Solicitud recibida exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/cotizaciones', async (req, res) => {
    try {
        const cotizaciones = await Cotizacion.find({});
        res.json(cotizaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/cotizacion/:id', async (req, res) => {
    try {
        const { precioUnitario, total } = req.body;
        const cotizacion = await Cotizacion.findById(req.params.id);
        
        if (!cotizacion) {
            return res.status(404).json({ error: 'Cotización no encontrada' });
        }
        
        cotizacion.precioUnitario = precioUnitario;
        cotizacion.total = total;
        cotizacion.estado = 'cotizado';
        
        await cotizacion.save();
        
        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: cotizacion.emailCliente,
            subject: 'Cotización Detallada',
            html: `
                <h2>Detalles de su cotización</h2>
                <p>Producto: ${cotizacion.producto}</p>
                <p>Cantidad: ${cotizacion.cantidad}</p>
                <p>Precio Unitario: $${precioUnitario}</p>
                <p>Total: $${total}</p>
                <p>Para confirmar, por favor responda este correo.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ message: 'Cotización actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
