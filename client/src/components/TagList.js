import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButtons,
  IonMenuButton
} from '@ionic/react';
import { locationOutline, timeOutline, refreshOutline } from 'ionicons/icons';
import Tag from '../models/Tag';

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Simulate initial tag data
  useEffect(() => {
    const initialTags = [
      new Tag('1', 'EPC123456', 'Warehouse A', 'in_stock', new Date()),
      new Tag('2', 'EPC789012', 'Loading Dock', 'in_transit', new Date()),
      new Tag('3', 'EPC345678', 'Store Front', 'delivered', new Date())
    ];
    setTags(initialTags);
  }, []);

  // Simulate RFID scanning
  const simulateScan = () => {
    const newTag = Tag.createFromScan(
      `EPC${Math.floor(Math.random() * 1000000)}`,
      'Scan Station 1'
    );
    setTags(prevTags => [...prevTags, newTag]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'in_transit': return 'warning';
      case 'delivered': return 'primary';
      case 'lost': return 'danger';
      default: return 'medium';
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.epc.toLowerCase().includes(searchText.toLowerCase()) ||
    tag.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>RFID Tags</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={simulateScan}>
              <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value)}
            placeholder="Search tags..."
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {filteredTags.map(tag => (
            <IonItem key={tag.id}>
              <IonLabel>
                <h2>EPC: {tag.epc}</h2>
                <p>
                  <IonIcon icon={locationOutline} />
                  {tag.location}
                </p>
                <p>
                  <IonIcon icon={timeOutline} />
                  Last scanned: {new Date(tag.lastScanned).toLocaleString()}
                </p>
              </IonLabel>
              <IonBadge color={getStatusColor(tag.status)} slot="end">
                {tag.status.replace('_', ' ')}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TagList; 