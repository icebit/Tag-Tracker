import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonBackButton,
  IonButtons,
  IonItem,
  IonLabel
} from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AddItem: React.FC = () => {
  const [name, setName] = useState('');
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/items', { name });
      history.push('/');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Add New Item</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Item Name</IonLabel>
            <IonInput
              value={name}
              onIonChange={e => setName(e.detail.value!)}
              required
            />
          </IonItem>
          <IonButton expand="block" type="submit" className="ion-margin">
            Add Item
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddItem; 