import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { analytics, tag } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Menu = () => {
  const history = useHistory();

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={() => history.push('/dashboard')}>
            <IonIcon slot="start" icon={analytics} />
            <IonLabel>Analytics Dashboard</IonLabel>
          </IonItem>
          <IonItem button onClick={() => history.push('/tags')}>
            <IonIcon slot="start" icon={tag} />
            <IonLabel>Tag Management</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu; 