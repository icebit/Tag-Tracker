import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ItemList from '../components/ItemList';

const Items: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Items</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ItemList />
      </IonContent>
    </IonPage>
  );
};

export default Items; 