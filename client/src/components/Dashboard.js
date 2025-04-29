import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/react';
import { 
  cubeOutline,
  timeOutline,
  checkmarkDoneOutline,
  alertCircleOutline
} from 'ionicons/icons';

const Dashboard = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={cubeOutline} /> In Stock
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2>150</h2>
                  <p>Items currently in stock</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={timeOutline} /> In Transit
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2>45</h2>
                  <p>Items in transit</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={checkmarkDoneOutline} /> Delivered
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2>320</h2>
                  <p>Items delivered today</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={alertCircleOutline} /> Lost
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2>2</h2>
                  <p>Items reported lost</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default Dashboard; 