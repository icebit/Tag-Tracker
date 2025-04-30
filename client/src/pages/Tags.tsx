import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonText,
  IonDatetime,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useState } from 'react';
import axios from 'axios';

interface Tag {
  id: string;
  name: string;
  status: 'inStock' | 'inTransit' | 'delivered' | 'lost';
  location: string;
  lastSeen: string;
}

const Tags: React.FC = () => {
  const [tag, setTag] = useState<Tag>({
    id: '',
    name: '',
    status: 'inStock',
    location: '',
    lastSeen: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/tags', tag);
      // Reset form
      setTag({
        id: '',
        name: '',
        status: 'inStock',
        location: '',
        lastSeen: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tags</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tags</IonTitle>
          </IonToolbar>
        </IonHeader>

        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Tag ID</IonLabel>
              <IonInput
                value={tag.id}
                onIonChange={e => setTag({ ...tag, id: e.detail.value! })}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={tag.name}
                onIonChange={e => setTag({ ...tag, name: e.detail.value! })}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Status</IonLabel>
              <IonSelect
                value={tag.status}
                onIonChange={e => setTag({ ...tag, status: e.detail.value })}
              >
                <IonSelectOption value="inStock">In Stock</IonSelectOption>
                <IonSelectOption value="inTransit">In Transit</IonSelectOption>
                <IonSelectOption value="delivered">Delivered</IonSelectOption>
                <IonSelectOption value="lost">Lost</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Location</IonLabel>
              <IonInput
                value={tag.location}
                onIonChange={e => setTag({ ...tag, location: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Last Seen</IonLabel>
              <IonDatetime
                value={tag.lastSeen}
                onIonChange={e => setTag({ ...tag, lastSeen: e.detail.value as string })}
                presentation="date-time"
              />
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="block" type="submit">
                  Add Tag
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Tags; 