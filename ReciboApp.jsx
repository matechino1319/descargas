import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ReciboApp() {
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [recibo, setRecibo] = useState(null);

 
  const reciboRef = useRef(null); 

  const generarRecibo = (e) => {
    e.preventDefault();
    const total = cantidad * precio;
    setRecibo({ nombre, producto, cantidad, precio, total });
  };

  const descargarPDF = () => {
    if (!reciboRef.current) {
        console.error("Referencia al recibo no encontrada.");
        return;
    }

    
    setTimeout(async () => {
      try {
          
          const canvas = await html2canvas(reciboRef.current, { 
              scale: 3, 
              useCORS: true 
          });
          
          const imgData = canvas.toDataURL('image/png');

          
          const pdf = new jsPDF('p', 'mm', 'a4'); 
          const pdfWidth = pdf.internal.pageSize.getWidth();
          
          
          const imgProps = pdf.getImageProperties(imgData);
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

         
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          
          const safeName = nombre.replace(/\s/g, '_').toLowerCase() || 'cliente';
          pdf.save(`recibo_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`);

      } catch (error) {
          console.error("Error al generar el PDF:", error);
          alert("Ocurrió un error al generar el PDF. Verifica si eliminaste el CSS de ejemplo.");
      }
    }, 50); 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1>Generador de Recibo</h1>
      <form onSubmit={generarRecibo} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Cliente:</label>
          <input 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            style={{ width: '95%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción del Producto:</label>
          <input 
            value={producto} 
            onChange={(e) => setProducto(e.target.value)} 
            required 
            style={{ width: '95%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            min="1"
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
            required
            style={{ width: '95%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Precio Unitario ($):</label>
          <input
            type="number"
            value={precio}
            min="0"
            step="0.01"
            onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
            required
            style={{ width: '95%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Generar Recibo
        </button>
      </form>

      {recibo && (
        <>
          
          <div 
            ref={reciboRef} 
            style={{ 
              marginTop: '30px', 
              border: '2px solid #000', 
              padding: '20px', 
              width: '300px', 
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              backgroundColor: '#f9f9f9' 
            }}
          >
            <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>RECIBO OFICIAL</h2>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {recibo.nombre}</p>
            <hr style={{ margin: '10px 0' }} />
            <p><strong>Producto:</strong> {recibo.producto}</p>
            <p><strong>Cantidad:</strong> {recibo.cantidad}</p>
            <p><strong>Precio U.:</strong> **$**{recibo.precio.toFixed(2)}</p>
            <h3 style={{ marginTop: '20px', color: '#28a745' }}>**TOTAL:** **$**{recibo.total.toFixed(2)}</h3>
          </div>
          
          
          <button 
            onClick={descargarPDF} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📥 Descargar PDF
          </button>
        </>
      )}
    </div>
  );
}

export default ReciboApp;