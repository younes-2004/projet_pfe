import React, { useEffect, useRef } from 'react';
import { Chart } from "chart.js/auto";

const ChartComponent = ({ type, data, options, title }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Si le graphique existe déjà, le détruire avant d'en créer un nouveau
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Créer un nouveau graphique
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          ...options?.plugins
        },
        ...options
      }
    });

    // Nettoyer lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options, type, title]);

  return (
    <div>
      <canvas ref={chartRef} height={250}></canvas>
    </div>
  );
};

export default ChartComponent;