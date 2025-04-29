import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';
import { Chart, registerables } from 'chart.js';
import { io } from 'socket.io-client';

// Register Chart.js components
Chart.register(...registerables);

const AnalyticsDashboard = () => {
  const [tagStats, setTagStats] = useState({
    total: 0,
    inStock: 0,
    inTransit: 0,
    delivered: 0,
    lost: 0
  });
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3000');

    socketRef.current.on('new_tag', (tagData) => {
      setTagStats(prevStats => ({
        ...prevStats,
        total: prevStats.total + 1,
        [tagData.status]: prevStats[tagData.status] + 1
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['In Stock', 'In Transit', 'Delivered', 'Lost'],
          datasets: [{
            data: [
              tagStats.inStock,
              tagStats.inTransit,
              tagStats.delivered,
              tagStats.lost
            ],
            backgroundColor: [
              '#2dd36f',
              '#ffc409',
              '#3dc2ff',
              '#eb445a'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [tagStats]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analytics Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Tag Status Distribution</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ height: '300px' }}>
                    <canvas ref={chartRef}></canvas>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Tag Statistics</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Total Tags: {tagStats.total}</p>
                  <p>In Stock: {tagStats.inStock}</p>
                  <p>In Transit: {tagStats.inTransit}</p>
                  <p>Delivered: {tagStats.delivered}</p>
                  <p>Lost: {tagStats.lost}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsDashboard; 