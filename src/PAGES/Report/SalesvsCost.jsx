import React, { useState, useEffect } from 'react';
import { useBranch } from '../../CONTEXTS/BranchContext';
import { getWeeklyProfitsByBranchRequest, getIngredientsByBranchRequest } from '../../api/branch';
import LoadingMessage from '../../GENERALCOMPONENTS/LoandingMessage';
import AcceptMessage from '../../GENERALCOMPONENTS/AcceptMessage';

const Report = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-8">Panel de Reportes</h1>
    <ReportSalesCost />
  </div>
);

const ReportSalesCost = () => {
  const [weeklyData, setWeeklyData] = useState({
    totalRevenue: 0,
    totalCost: 0,
    profit: 0,
    salesCount: 0,
    startDate: null,
    endDate: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedBranch } = useBranch();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!selectedBranch) {
        setError('Por favor seleccione una sucursal');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const branchName = typeof selectedBranch === 'string' ? selectedBranch : selectedBranch.nameBranch;
        const response = await getWeeklyProfitsByBranchRequest(branchName);
        if (response.data?.data) {
          setWeeklyData(response.data.data);
        }
      } catch (error) {
        setError('Error al cargar los datos. Por favor intente nuevamente.');
        console.error('Error fetching weekly data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [selectedBranch]);

  if (isLoading) return <LoadingMessage />;
  if (error) return <AcceptMessage message={error} onAccept={() => setError(null)} />;

  const dateRange = weeklyData.startDate && weeklyData.endDate ? 
    `${new Date(weeklyData.startDate).toLocaleDateString()} - ${new Date(weeklyData.endDate).toLocaleDateString()}` : 
    'Período actual';

  return (
    <div className="space-y-8">
      <div className="text-lg text-gray-600 mb-4">
        Reporte de {dateRange}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Ventas Totales</h3>
          <p className="text-2xl font-bold text-blue-600">
            Bs. {weeklyData.totalRevenue?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Promedio por venta: Bs. {weeklyData.salesCount ? (weeklyData.totalRevenue / weeklyData.salesCount).toFixed(2) : '0.00'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Costos Totales</h3>
          <p className="text-2xl font-bold text-red-600">
            {weeklyData.totalCost ? `Bs. ${weeklyData.totalCost.toFixed(2)}` : 'No disponible'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Ganancia</h3>
          <p className="text-2xl font-bold text-green-600">
            {weeklyData.profit ? `Bs. ${weeklyData.profit.toFixed(2)}` : 'No disponible'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Ventas</h3>
          <p className="text-2xl font-bold text-gray-800">
            {weeklyData.salesCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;