import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Dashboard = () => {
  // Datos de ejemplo
  const totalProducts = 36621;
  const totalSales = 50000;
  const totalCost = 23530;
  const totalProfit = totalSales - totalCost;
  const profitMargin = ((totalProfit / totalSales) * 100).toFixed(2);

  const lastSoldProducts = [
    { id: 1, name: 'asdf', description: 'ixcv', category: 'qwer', unitPrice: 400, quantity: 2 },
    { id: 2, name: 'ghjk', description: 'bmn', category: 'tyui', unitPrice: 1000, quantity: 5 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Total de Productos</h2>
            <p className="text-2xl">{totalProducts.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Total Ventas Hoy</h2>
            <p className="text-2xl">${totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Alertas</h2>
            <p>No hay alertas</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Reporte de Ganancias</h2>
            <p>Ventas Totales: ${totalSales.toLocaleString()}</p>
            <p>Costo Total: ${totalCost.toLocaleString()}</p>
            <p className="font-bold text-xl mt-2">TOTAL: ${totalProfit.toLocaleString()}</p>
            <p>Margen de Ganancia: {profitMargin}%</p>
          </div>

          <div className="bg-white p-4 rounded shadow overflow-auto max-h-96">
            <h2 className="text-lg font-semibold mb-2">Últimos Productos Vendidos</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Nombre</th>
                  <th className="border-b p-2">Descripción</th>
                  <th className="border-b p-2">Categoría</th>
                  <th className="border-b p-2">Precio Unitario</th>
                  <th className="border-b p-2">Cantidad</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lastSoldProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="border-b p-2">{product.name}</td>
                    <td className="border-b p-2">{product.description}</td>
                    <td className="border-b p-2">{product.category}</td>
                    <td className="border-b p-2">${product.unitPrice}</td>
                    <td className="border-b p-2">{product.quantity}</td>
                    <td className="border-b p-2">
                      <button className="text-red-600 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
