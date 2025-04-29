import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { io } from 'socket.io-client';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({
    id: '',
    name: '',
    status: 'inStock',
    location: '',
    lastSeen: new Date()
  });
  const socketRef = useRef(null);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3000'}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
    
    // Configure Socket.IO client
    socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected successfully');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Reconnect if the server disconnects
        socketRef.current.connect();
      }
    });

    socketRef.current.on('tag_update', (updatedTag) => {
      setTags(prevTags => 
        prevTags.map(tag => 
          tag.id === updatedTag.id ? updatedTag : tag
        )
      );
    });

    socketRef.current.on('new_tag', (newTag) => {
      setTags(prevTags => [...prevTags, newTag]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleCreateTag = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3000'}/api/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTag),
      });

      if (response.ok) {
        const createdTag = await response.json();
        setTags([...tags, createdTag]);
        setNewTag({
          id: '',
          name: '',
          status: 'inStock',
          location: '',
          lastSeen: new Date()
        });
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleUpdateStatus = async (tagId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3000'}/api/tags/${tagId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTag = await response.json();
        setTags(prevTags => 
          prevTags.map(tag => 
            tag.id === updatedTag.id ? updatedTag : tag
          )
        );
      }
    } catch (error) {
      console.error('Error updating tag status:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tag Management</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Create New Tag</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonLabel position="stacked">Tag ID</IonLabel>
                    <IonInput
                      value={newTag.id}
                      onIonChange={e => setNewTag({ ...newTag, id: e.detail.value })}
                      placeholder="Enter tag ID"
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Name</IonLabel>
                    <IonInput
                      value={newTag.name}
                      onIonChange={e => setNewTag({ ...newTag, name: e.detail.value })}
                      placeholder="Enter tag name"
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Status</IonLabel>
                    <IonSelect
                      value={newTag.status}
                      onIonChange={e => setNewTag({ ...newTag, status: e.detail.value })}
                    >
                      <IonSelectOption value="inStock">In Stock</IonSelectOption>
                      <IonSelectOption value="inTransit">In Transit</IonSelectOption>
                      <IonSelectOption value="delivered">Delivered</IonSelectOption>
                      <IonSelectOption value="lost">Lost</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <div style={{ marginTop: '20px' }}>
                    <IonButton expand="block" onClick={handleCreateTag}>
                      <IonIcon icon={add} slot="start" />
                      Create Tag
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Active Tags</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    {tags.map(tag => (
                      <IonItem key={tag.id}>
                        <IonLabel>
                          <h2>{tag.name}</h2>
                          <p>ID: {tag.id}</p>
                          <p>Location: {tag.location}</p>
                          <p>Last Seen: {new Date(tag.lastSeen).toLocaleString()}</p>
                        </IonLabel>
                        <IonSelect
                          value={tag.status}
                          onIonChange={e => handleUpdateStatus(tag.id, e.detail.value)}
                        >
                          <IonSelectOption value="inStock">In Stock</IonSelectOption>
                          <IonSelectOption value="inTransit">In Transit</IonSelectOption>
                          <IonSelectOption value="delivered">Delivered</IonSelectOption>
                          <IonSelectOption value="lost">Lost</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TagManagement; 