import { useEffect, useRef } from 'react';

/**
 * Hook para gestionar la lógica de los gráficos de leads
 * @param {Object} chartRefs - Referencias de los canvas para los gráficos
 * @param {Object} metrics - Métricas calculadas de los leads
 * @param {Boolean} isLoading - Estado de carga
 */
export const useLeadCharts = (chartRefs, metrics, isLoading) => {
  // Referencias para las instancias de charts en lugar de estados
  const chartsInstancesRef = useRef({
    typeChart: null,
    statusChart: null,
    typeMobileChart: null,
    statusMobileChart: null,
    conversionChart: null
  });

  // Efecto para renderizar los gráficos
  useEffect(() => {
    // Limpiar gráficos existentes antes de renderizar nuevos
    const cleanupCharts = () => {
      const charts = chartsInstancesRef.current;
      if (charts.typeChart) {
        charts.typeChart.destroy();
        charts.typeChart = null;
      }
      if (charts.statusChart) {
        charts.statusChart.destroy();
        charts.statusChart = null;
      }
      if (charts.typeMobileChart) {
        charts.typeMobileChart.destroy();
        charts.typeMobileChart = null;
      }
      if (charts.statusMobileChart) {
        charts.statusMobileChart.destroy();
        charts.statusMobileChart = null;
      }
      if (charts.conversionChart) {
        charts.conversionChart.destroy();
        charts.conversionChart = null;
      }
    };

    // Limpiar antes de intentar renderizar
    cleanupCharts();

    // Variable para controlar si el componente sigue montado
    let isMounted = true;

    // Importación dinámica de Chart.js
    const renderCharts = async () => {
      try {
        // Importar Chart.js dinámicamente para evitar errores de SSR
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);

        // Verificar que el componente sigue montado antes de renderizar
        if (!isMounted) return;

        // Limpiar una vez más antes de crear nuevos charts para evitar duplicados
        cleanupCharts();

        // Colores para cada gráfico
        const typeColors = [
          'rgba(124, 77, 255, 0.8)', // Morado
          'rgba(54, 162, 235, 0.8)', // Azul
          'rgba(255, 159, 64, 0.8)', // Naranja
          'rgba(180, 180, 180, 0.7)' // Gris para no clasificado
        ];

        const statusColors = [
          'rgba(75, 192, 192, 0.7)', // Verde
          'rgba(255, 99, 132, 0.7)', // Rojo
          'rgba(255, 205, 86, 0.7)', // Amarillo
          'rgba(153, 102, 255, 0.7)', // Morado
          'rgba(180, 180, 180, 0.7)' // Gris
        ];

        // Gráfico de tipo de usuario - DESKTOP
        if (chartRefs.typeChart.current) {
          const typeCtx = chartRefs.typeChart.current.getContext('2d');
          if (typeCtx) {
            typeCtx.clearRect(
              0,
              0,
              chartRefs.typeChart.current.width,
              chartRefs.typeChart.current.height
            );

            const newTypeChart = new Chart(typeCtx, {
              type: 'bar',
              data: {
                labels: metrics.byType.map(item => item.name),
                datasets: [
                  {
                    label: 'Leads por Tipo',
                    data: metrics.byType.map(item => item.value),
                    backgroundColor: typeColors,
                    borderColor: typeColors.map(color =>
                      color.replace('0.8', '1')
                    ),
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
                    titleColor: 'rgba(255, 255, 255, 0.9)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    padding: 10,
                    callbacks: {
                      label: function (context) {
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage =
                          total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${context.label}: ${value} leads (${percentage}%)`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      display: true,
                      color: 'rgba(150, 150, 150, 0.9)',
                      font: {
                        size: 10
                      }
                    }
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      color: 'rgba(150, 150, 150, 0.9)',
                      font: {
                        size: 11
                      },
                      padding: 10
                    }
                  }
                }
              }
            });
            if (isMounted) {
              chartsInstancesRef.current.typeChart = newTypeChart;
            } else {
              newTypeChart.destroy();
            }
          }
        }

        // Gráfico de tipo de usuario - MOBILE
        if (chartRefs.typeMobileChart.current) {
          const typeCtx = chartRefs.typeMobileChart.current.getContext('2d');
          if (typeCtx) {
            typeCtx.clearRect(
              0,
              0,
              chartRefs.typeMobileChart.current.width,
              chartRefs.typeMobileChart.current.height
            );

            const newTypeMobileChart = new Chart(typeCtx, {
              type: 'bar',
              data: {
                labels: metrics.byType.map(item => item.name),
                datasets: [
                  {
                    label: 'Leads por Tipo',
                    data: metrics.byType.map(item => item.value),
                    backgroundColor: typeColors,
                    borderColor: typeColors.map(color =>
                      color.replace('0.8', '1')
                    ),
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
                    titleColor: 'rgba(255, 255, 255, 0.9)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    padding: 10,
                    callbacks: {
                      label: function (context) {
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage =
                          total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${context.label}: ${value} leads (${percentage}%)`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      display: true,
                      color: 'rgba(150, 150, 150, 0.9)',
                      font: {
                        size: 10
                      }
                    }
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      color: 'rgba(150, 150, 150, 0.9)',
                      font: {
                        size: 11
                      },
                      padding: 10
                    }
                  }
                }
              }
            });
            if (isMounted) {
              chartsInstancesRef.current.typeMobileChart = newTypeMobileChart;
            } else {
              newTypeMobileChart.destroy();
            }
          }
        }

        // Gráfico de estado de leads - DESKTOP
        if (chartRefs.statusChart.current) {
          const statusCtx = chartRefs.statusChart.current.getContext('2d');
          if (statusCtx) {
            statusCtx.clearRect(
              0,
              0,
              chartRefs.statusChart.current.width,
              chartRefs.statusChart.current.height
            );

            // Mapeo de colores por estado según los requerimientos
            const getStatusColor = status => {
              const colorMap = {
                nuevo: 'rgba(75, 192, 192, 0.95)', // Verde más vibrante
                proceso: 'rgba(255, 205, 86, 0.95)', // Amarillo más vibrante
                cliente: 'rgba(33, 33, 33, 0.95)', // Negro
                contactado: 'rgba(54, 162, 235, 0.95)', // Azul
                'sin estado': 'rgba(180, 180, 180, 0.95)', // Gris
                perdido: 'rgba(255, 99, 132, 0.95)' // Rojo
              };

              // Convertir a minúsculas para comparación case-insensitive
              const normalizedStatus = status.toLowerCase();
              return colorMap[normalizedStatus] || 'rgba(180, 180, 180, 0.95)'; // Default gris
            };

            // Crear colores personalizados basados en el estado
            const customStatusColors = metrics.byStatus.map(item =>
              getStatusColor(item.name)
            );

            // Colores para el anillo interno
            const innerRingColor = 'rgba(124, 77, 255, 0.8)'; // Morado para el anillo interno

            const newStatusChart = new Chart(statusCtx, {
              type: 'doughnut',
              data: {
                labels: metrics.byStatus.map(item => item.name),
                datasets: [
                  {
                    label: 'Leads por Estado',
                    data: metrics.byStatus.map(item => item.value),
                    backgroundColor: customStatusColors,
                    borderColor: 'white',
                    borderWidth: 2,
                    weight: 2,
                    hoverOffset: 20, // Mayor desplazamiento en hover
                    hoverBorderWidth: 3,
                    hoverBorderColor: 'white'
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%', // Reducido de 75% a 68% para hacer el anillo más grueso
                layout: {
                  padding: {
                    // Añadir padding para evitar que los tooltips queden cortados
                    top: 20,
                    right: 20,
                    bottom: 30, // Mayor padding abajo para tooltips en hover
                    left: 20
                  }
                },
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: 'rgba(150, 150, 150, 0.9)',
                      padding: 12,
                      font: {
                        size: 11
                      },
                      boxWidth: 12,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.95)',
                    titleColor: 'rgba(255, 255, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 1)',
                    padding: 14,
                    displayColors: true,
                    titleFont: {
                      size: 14,
                      weight: 'bold'
                    },
                    bodyFont: {
                      size: 13
                    },
                    position: 'nearest', // Mejor posicionamiento de tooltips
                    caretPadding: 10, // Padding para la flecha del tooltip
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage =
                          total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
                hover: {
                  mode: 'index',
                  intersect: false
                },
                animation: {
                  animateRotate: true,
                  animateScale: true,
                  duration: 1000,
                  easing: 'easeOutQuart'
                },
                onHover: (event, chartElements) => {
                  if (chartElements.length === 0) {
                    statusCtx.canvas.style.cursor = 'default';
                    // Restaurar opacidad normal si no hay elemento seleccionado
                    if (chartsInstancesRef.current.statusChart) {
                      chartsInstancesRef.current.statusChart.data.datasets[0].backgroundColor =
                        customStatusColors;
                      chartsInstancesRef.current.statusChart.update();
                    }
                  } else {
                    statusCtx.canvas.style.cursor = 'pointer';
                    // Reducir opacidad de los segmentos no seleccionados
                    if (chartsInstancesRef.current.statusChart) {
                      const activeIndex = chartElements[0].index;
                      const backgroundColors = customStatusColors.map(
                        (color, index) => {
                          if (index === activeIndex) {
                            return color; // Mantener el color original para el segmento activo
                          } else {
                            return color.replace(/[\d.]+\)$/, '0.3)'); // Reducir opacidad para los demás
                          }
                        }
                      );
                      chartsInstancesRef.current.statusChart.data.datasets[0].backgroundColor =
                        backgroundColors;
                      chartsInstancesRef.current.statusChart.update();
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

                    // Usar la tasa de conversión en lugar del total de leads
                    const conversionRate = metrics.conversionRate;

                    // Dibujar círculo interior
                    const radius =
                      Math.min(
                        chart.chartArea.right - chart.chartArea.left,
                        chart.chartArea.bottom - chart.chartArea.top
                      ) * 0.33; // Aumentado de 0.27 a 0.33

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                    ctx.fillStyle = innerRingColor;
                    ctx.fill();

                    // Borde blanco para el círculo
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Texto grande (porcentaje)
                    const fontSize = Math.min(width, height) / 12; // Aumentado de 14 a 12
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                      `${conversionRate}%`,
                      centerX,
                      centerY - fontSize * 0.3
                    );

                    // Texto pequeño (etiqueta)
                    const smallFontSize = fontSize * 0.5;
                    ctx.font = `${smallFontSize}px sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.fillText(
                      'Conversión',
                      centerX,
                      centerY + fontSize * 0.5
                    );

                    ctx.save();
                  }
                }
              ]
            });
            if (isMounted) {
              chartsInstancesRef.current.statusChart = newStatusChart;
            } else {
              newStatusChart.destroy();
            }
          }
        }

        // Gráfico de estado de leads - MOBILE
        if (chartRefs.statusMobileChart.current) {
          const statusCtx =
            chartRefs.statusMobileChart.current.getContext('2d');
          if (statusCtx) {
            statusCtx.clearRect(
              0,
              0,
              chartRefs.statusMobileChart.current.width,
              chartRefs.statusMobileChart.current.height
            );

            // Mapeo de colores por estado según los requerimientos
            const getStatusColor = status => {
              const colorMap = {
                nuevo: 'rgba(75, 192, 192, 0.95)', // Verde más vibrante
                proceso: 'rgba(255, 205, 86, 0.95)', // Amarillo más vibrante
                cliente: 'rgba(33, 33, 33, 0.95)', // Negro
                contactado: 'rgba(54, 162, 235, 0.95)', // Azul
                'sin estado': 'rgba(180, 180, 180, 0.95)', // Gris
                perdido: 'rgba(255, 99, 132, 0.95)' // Rojo
              };

              // Convertir a minúsculas para comparación case-insensitive
              const normalizedStatus = status.toLowerCase();
              return colorMap[normalizedStatus] || 'rgba(180, 180, 180, 0.95)'; // Default gris
            };

            // Crear colores personalizados basados en el estado
            const customStatusColors = metrics.byStatus.map(item =>
              getStatusColor(item.name)
            );

            // Colores para el anillo interno
            const innerRingColor = 'rgba(124, 77, 255, 0.8)'; // Morado para el anillo interno

            const newStatusMobileChart = new Chart(statusCtx, {
              type: 'doughnut',
              data: {
                labels: metrics.byStatus.map(item => item.name),
                datasets: [
                  {
                    label: 'Leads por Estado',
                    data: metrics.byStatus.map(item => item.value),
                    backgroundColor: customStatusColors,
                    borderColor: 'white',
                    borderWidth: 2,
                    weight: 2,
                    hoverOffset: 20, // Mayor desplazamiento en hover
                    hoverBorderWidth: 3,
                    hoverBorderColor: 'white'
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%', // Reducido de 75% a 68% para hacer el anillo más grueso
                layout: {
                  padding: {
                    // Añadir padding para evitar que los tooltips queden cortados
                    top: 20,
                    right: 20,
                    bottom: 30, // Mayor padding abajo para tooltips en hover
                    left: 20
                  }
                },
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: 'rgba(150, 150, 150, 0.9)',
                      padding: 12,
                      font: {
                        size: 11
                      },
                      boxWidth: 12,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.95)',
                    titleColor: 'rgba(255, 255, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 1)',
                    padding: 14,
                    displayColors: true,
                    titleFont: {
                      size: 14,
                      weight: 'bold'
                    },
                    bodyFont: {
                      size: 13
                    },
                    position: 'nearest', // Mejor posicionamiento de tooltips
                    caretPadding: 10, // Padding para la flecha del tooltip
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage =
                          total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
                hover: {
                  mode: 'index',
                  intersect: false
                },
                animation: {
                  animateRotate: true,
                  animateScale: true,
                  duration: 1000,
                  easing: 'easeOutQuart'
                },
                onHover: (event, chartElements) => {
                  if (chartElements.length === 0) {
                    statusCtx.canvas.style.cursor = 'default';
                    // Restaurar opacidad normal si no hay elemento seleccionado
                    if (chartsInstancesRef.current.statusMobileChart) {
                      chartsInstancesRef.current.statusMobileChart.data.datasets[0].backgroundColor =
                        customStatusColors;
                      chartsInstancesRef.current.statusMobileChart.update();
                    }
                  } else {
                    statusCtx.canvas.style.cursor = 'pointer';
                    // Reducir opacidad de los segmentos no seleccionados
                    if (chartsInstancesRef.current.statusMobileChart) {
                      const activeIndex = chartElements[0].index;
                      const backgroundColors = customStatusColors.map(
                        (color, index) => {
                          if (index === activeIndex) {
                            return color; // Mantener el color original para el segmento activo
                          } else {
                            return color.replace(/[\d.]+\)$/, '0.3)'); // Reducir opacidad para los demás
                          }
                        }
                      );
                      chartsInstancesRef.current.statusMobileChart.data.datasets[0].backgroundColor =
                        backgroundColors;
                      chartsInstancesRef.current.statusMobileChart.update();
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

                    // Usar la tasa de conversión en lugar del total de leads
                    const conversionRate = metrics.conversionRate;

                    // Dibujar círculo interior
                    const radius =
                      Math.min(
                        chart.chartArea.right - chart.chartArea.left,
                        chart.chartArea.bottom - chart.chartArea.top
                      ) * 0.33; // Aumentado de 0.27 a 0.33

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                    ctx.fillStyle = innerRingColor;
                    ctx.fill();

                    // Borde blanco para el círculo
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Texto grande (porcentaje)
                    const fontSize = Math.min(width, height) / 12; // Aumentado de 14 a 12
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                      `${conversionRate}%`,
                      centerX,
                      centerY - fontSize * 0.3
                    );

                    // Texto pequeño (etiqueta)
                    const smallFontSize = fontSize * 0.5;
                    ctx.font = `${smallFontSize}px sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.fillText(
                      'Conversión',
                      centerX,
                      centerY + fontSize * 0.5
                    );

                    ctx.save();
                  }
                }
              ]
            });
            if (isMounted) {
              chartsInstancesRef.current.statusMobileChart =
                newStatusMobileChart;
            } else {
              newStatusMobileChart.destroy();
            }
          }
        }
      } catch (error) {
        console.error('Error al renderizar los gráficos:', error);
      }
    };

    renderCharts();

    // Cleanup cuando el componente se desmonta o el efecto se vuelve a ejecutar
    return () => {
      isMounted = false;
      cleanupCharts();
    };
  }, [metrics, isLoading, chartRefs]); // Solo dependencias esenciales
};
