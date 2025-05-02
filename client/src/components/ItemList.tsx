import {
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonModal,
  IonInput,
  IonFooter,
  IonTextarea,
  IonBadge,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonText,
  IonPage,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { add, trash, create } from 'ionicons/icons';
import axios from 'axios';
import { API_URL } from '../config';

interface Tag {
  _id: string;
  epc: string;
  status: 'inStock' | 'inTransit' | 'delivered' | 'lost';
  location: string;
  lastSeen: string;
  isActive: boolean;
}

interface Item {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  value?: number;
  owner?: string;
  purchaseDate?: string;
  tags: Tag[];
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    description: '',
    category: '',
    value: 0,
    owner: '',
    purchaseDate: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchText]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      setAddError(null);
      
      if (!newItem.name) {
        setAddError('Please enter an item name');
        return;
      }
      
      const response = await axios.post(`${API_URL}/api/items`, newItem);
      setItems([...items, response.data]);
      setShowAddModal(false);
      setNewItem({
        name: '',
        description: '',
        category: '',
        value: 0,
        owner: '',
        purchaseDate: '',
      });
    } catch (error) {
      console.error('Error adding item:', error);
      setAddError('Failed to add item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/api/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = async () => {
    try {
      setEditError(null);
      
      if (!editingItem) return;
      if (!editingItem.name) {
        setEditError('Please enter an item name');
        return;
      }
      
      const response = await axios.patch(`${API_URL}/api/items/${editingItem._id}`, {
        name: editingItem.name,
        description: editingItem.description,
        category: editingItem.category,
        value: editingItem.value,
        owner: editingItem.owner,
        purchaseDate: editingItem.purchaseDate
      });
      
      setItems(items.map(item => item._id === editingItem._id ? response.data : item));
      setShowEditModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error editing item:', error);
      setEditError('Failed to update item. Please try again.');
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    if (searchText) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inStock':
        return 'success';
      case 'inTransit':
        return 'warning';
      case 'delivered':
        return 'primary';
      case 'lost':
        return 'danger';
      default:
        return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Item Management</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowAddModal(true)}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Search items..."
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isLoading ? (
          <div className="ion-padding">Loading...</div>
        ) : (
          <IonList>
            {filteredItems.map(item => (
              <IonItem key={item._id}>
                <IonLabel>
                  <h2>{item.name}</h2>
                  <p>{item.description || 'No description'}</p>
                  <p>Category: {item.category || 'Uncategorized'}</p>
                  {item.value && <p>Value: ${item.value.toFixed(2)}</p>}
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton onClick={() => {
                    setEditingItem(item);
                    setShowEditModal(true);
                  }}>
                    <IonIcon slot="icon-only" icon={create} />
                  </IonButton>
                  <IonButton onClick={() => handleDeleteItem(item._id)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonButton>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>

      <IonModal isOpen={showAddModal} onDidDismiss={() => {
        setShowAddModal(false);
        setAddError(null);
      }}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Item</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => {
                setShowAddModal(false);
                setAddError(null);
              }}>Cancel</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {addError && (
            <IonText color="danger">
              <p>{addError}</p>
            </IonText>
          )}
          <IonInput
            label="Name"
            labelPlacement="floating"
            value={newItem.name}
            onIonChange={e => setNewItem({ ...newItem, name: e.detail.value! })}
            placeholder="Enter item name"
          />
          <IonTextarea
            label="Description"
            labelPlacement="floating"
            value={newItem.description}
            onIonChange={e => setNewItem({ ...newItem, description: e.detail.value! })}
            placeholder="Enter item description"
          />
          <IonInput
            label="Category"
            labelPlacement="floating"
            value={newItem.category}
            onIonChange={e => setNewItem({ ...newItem, category: e.detail.value! })}
            placeholder="Enter category"
          />
          <IonInput
            label="Value"
            labelPlacement="floating"
            type="number"
            value={newItem.value}
            onIonChange={e => setNewItem({ ...newItem, value: parseFloat(e.detail.value!) })}
            placeholder="Enter value"
          />
          <IonInput
            label="Owner"
            labelPlacement="floating"
            value={newItem.owner}
            onIonChange={e => setNewItem({ ...newItem, owner: e.detail.value! })}
            placeholder="Enter owner"
          />
          <IonInput
            label="Purchase Date"
            labelPlacement="floating"
            type="date"
            value={newItem.purchaseDate}
            onIonChange={e => setNewItem({ ...newItem, purchaseDate: e.detail.value! })}
          />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" onClick={handleAddItem}>
              Add Item
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>

      <IonModal isOpen={showEditModal} onDidDismiss={() => {
        setShowEditModal(false);
        setEditError(null);
      }}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Item</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => {
                setShowEditModal(false);
                setEditError(null);
              }}>Cancel</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {editError && (
            <IonText color="danger">
              <p>{editError}</p>
            </IonText>
          )}
          <IonInput
            label="Name"
            labelPlacement="floating"
            value={editingItem?.name}
            onIonChange={e => editingItem && setEditingItem({ ...editingItem, name: e.detail.value! })}
            placeholder="Enter item name"
          />
          <IonTextarea
            label="Description"
            labelPlacement="floating"
            value={editingItem?.description}
            onIonChange={e => editingItem && setEditingItem({ ...editingItem, description: e.detail.value! })}
            placeholder="Enter item description"
          />
          <IonInput
            label="Category"
            labelPlacement="floating"
            value={editingItem?.category}
            onIonChange={e => editingItem && setEditingItem({ ...editingItem, category: e.detail.value! })}
            placeholder="Enter category"
          />
          <IonInput
            label="Value"
            labelPlacement="floating"
            type="number"
            value={editingItem?.value}
            onIonChange={e => editingItem && setEditingItem({ ...editingItem, value: parseFloat(e.detail.value!) })}
            placeholder="Enter value"
          />
          <IonInput
            label="Owner"
            labelPlacement="floating"
            value={editingItem?.owner}
            onIonChange={e => editingItem && setEditingItem({ ...editingItem, owner: e.detail.value! })}
            placeholder="Enter owner"
          />
          <IonInput
            label="Purchase Date"
            labelPlacement="floating"
            type="date"
            value={editingItem?.purchaseDate}
            onIonChange={e => editingItem && setEditingItem({ ...editingItem, purchaseDate: e.detail.value! })}
          />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" onClick={handleEditItem}>
              Save Changes
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    </IonPage>
  );
};

export default ItemList; 