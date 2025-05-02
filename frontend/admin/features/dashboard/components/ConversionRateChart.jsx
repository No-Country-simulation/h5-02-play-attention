'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import Chart from 'chart.js/auto';

/**
 * Componente para mostrar gráfico de tasa de conversión
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse específicamente
 * de mostrar el gráfico de conversión
 */
export default function ConversionRateChart({ conversionRate }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Limpiar cualquier gráfico existente
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Si no hay elemento canvas o datos, no hacer nada
    if (!chartRef.current || conversionRate === undefined) return;

    const ctx = chartRef.current.getContext('2d');

    // Colores para el gráfico
    const innerRingColor = '#2e1a47'; // Color violeta que coincide con el sidebar
    const convertedColor = '#10b981'; // Emerald 500
    const nonConvertedColor = '#f43f5e'; // Rose 500

    // Calcular porcentajes, asegurándose de que sean números válidos
    let conversionPercentage = 0;
    try {
      conversionPercentage = parseFloat(conversionRate) || 0;
      // Asegurar que el valor está entre 0 y 100
      conversionPercentage = Math.max(0, Math.min(100, conversionPercentage));
      // Redondear a 1 decimal para mejor visualización
      conversionPercentage = Math.round(conversionPercentage * 10) / 10;
    } catch (e) {
      conversionPercentage = 0;
    }

    const nonConversionPercentage = 100 - conversionPercentage;

    // Crear el gráfico
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Convertidos', 'No convertidos'],
        datasets: [
          {
            data: [conversionPercentage, nonConversionPercentage],
            backgroundColor: [convertedColor, nonConvertedColor],
            borderWidth: 0,
            borderRadius: 5,
            hoverOffset: 5
          }
        ]
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      },
      plugins: [
        {
          id: 'centerText',
          beforeDraw: function (chart) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;

            ctx.restore();

            // Calcular el centro correcto teniendo en cuenta el padding
            const chartArea = chart.chartArea;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            // Dibujar círculo interior
            const radius =
              Math.min(
                chart.chartArea.right - chart.chartArea.left,
                chart.chartArea.bottom - chart.chartArea.top
              ) * 0.36;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = innerRingColor;
            ctx.fill();

            // Borde blanco para el círculo
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Texto grande (porcentaje)
            const fontSize = Math.min(width, height) / 10;
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              `${conversionPercentage}%`,
              centerX,
              centerY - fontSize * 0.2
            );

            // Texto pequeño (etiqueta)
            const smallFontSize = fontSize * 0.5;
            ctx.font = `${smallFontSize}px sans-serif`;
            ctx.fillText('CONVERSIÓN', centerX, centerY + fontSize * 0.5);

            ctx.save();
          }
        }
      ]
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [conversionRate]);

  return (
    <Card className='h-full w-full'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xl'>Tasa de Conversión</CardTitle>
      </CardHeader>
      <CardContent className='flex justify-center items-center'>
        <div className='h-[280px] w-full'>
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
