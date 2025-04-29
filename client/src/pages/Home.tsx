import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { add } from 'ionicons/icons';
import axios from 'axios';

interface Item {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
}

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const updateItemStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/items/${id}`, {
        status: newStatus
      });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TagTracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {items.map((item) => (
            <IonItem key={item._id}>
              <IonLabel>
                <h2>{item.name}</h2>
                <p>Status: {item.status}</p>
                <p>Created: {new Date(item.createdAt).toLocaleDateString()}</p>
              </IonLabel>
              <IonButton
                onClick={() => updateItemStatus(item._id, 'in_progress')}
                color="warning"
                fill="outline"
              >
                In Progress
              </IonButton>
              <IonButton
                onClick={() => updateItemStatus(item._id, 'completed')}
                color="success"
                fill="outline"
              >
                Complete
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home; 