import {
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonChip,
  IonModal,
  IonInput,
  IonFooter,
  IonText,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { add, trash, create } from 'ionicons/icons';
import axios from 'axios';

interface Item {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  value?: number;
  owner?: string;
  purchaseDate?: string;
  tags?: string[];
}

interface Tag {
  _id: string;
  epc: string;
  status: 'inStock' | 'inTransit' | 'delivered' | 'lost';
  location: string;
  lastSeen: string;
  item: {
    _id: string;
    name: string;
    description?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const TagList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastSeen');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTag, setNewTag] = useState({
    epc: '',
    status: 'inStock' as const,
    location: '',
    item: '',
    lastSeen: new Date().toISOString().slice(0, 16)
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/items');
      setItems(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
      return [];
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tags');
      setTags(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]);
      return [];
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // First fetch items, then tags
      const itemsData = await fetchItems();
      const tagsData = await fetchTags();
      
      // Update both states
      setItems(itemsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortTags();
  }, [tags, items, searchText, statusFilter, sortBy]);

  const handleAddTag = async () => {
    try {
      setAddError(null);
      
      if (!newTag.item) {
        setAddError('Please select an item');
        return;
      }
      if (!newTag.epc) {
        setAddError('Please enter an EPC');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/tags', {
        epc: newTag.epc,
        status: newTag.status,
        location: newTag.location,
        lastSeen: newTag.lastSeen,
        item: newTag.item
      });
      
      setTags([...tags, response.data]);
      setShowAddModal(false);
      setNewTag({
        epc: '',
        status: 'inStock',
        location: '',
        item: '',
        lastSeen: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      setAddError('Failed to add tag. Please try again.');
    }
  };

  const filterAndSortTags = () => {
    let filtered = [...tags];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(tag => 
        tag.epc.toLowerCase().includes(searchText.toLowerCase()) ||
        tag.location.toLowerCase().includes(searchText.toLowerCase()) ||
        (items.find(item => item._id === tag.item._id)?.name.toLowerCase().includes(searchText.toLowerCase()) || false)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tag => tag.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'epc':
          return a.epc.localeCompare(b.epc);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'item':
          return a.item._id.localeCompare(b.item._id);
        case 'lastSeen':
        default:
          return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      }
    });

    setFilteredTags(filtered);
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

  const handleClearAllTags = async () => {
    try {
      await axios.delete('http://localhost:3000/api/tags');
      setTags([]);
      setFilteredTags([]);
    } catch (error) {
      console.error('Error clearing tags:', error);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/tags/${id}`);
      setTags(tags.filter(tag => tag._id !== id));
      setFilteredTags(filteredTags.filter(tag => tag._id !== id));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleEditTag = async () => {
    try {
      setEditError(null);
      
      if (!editingTag) return;
      if (!editingTag.item) {
        setEditError('Please select an item');
        return;
      }
      if (!editingTag.epc) {
        setEditError('Please enter an EPC');
        return;
      }
      
      const response = await axios.patch(`http://localhost:3000/api/tags/${editingTag._id}`, {
        epc: editingTag.epc,
        status: editingTag.status,
        location: editingTag.location,
        item: editingTag.item._id,
        lastSeen: editingTag.lastSeen || new Date().toISOString()
      });
      
      setTags(tags.map(tag => tag._id === editingTag._id ? response.data : tag));
      setShowEditModal(false);
      setEditingTag(null);
    } catch (error) {
      console.error('Error editing tag:', error);
      setEditError('Failed to update tag. Please try again.');
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tag Management</IonTitle>
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
            placeholder="Search tags..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSelect
            value={statusFilter}
            onIonChange={e => setStatusFilter(e.detail.value)}
            placeholder="Filter by status"
            interface="popover"
          >
            <IonSelectOption value="all">All Statuses</IonSelectOption>
            <IonSelectOption value="inStock">In Stock</IonSelectOption>
            <IonSelectOption value="inTransit">In Transit</IonSelectOption>
            <IonSelectOption value="delivered">Delivered</IonSelectOption>
            <IonSelectOption value="lost">Lost</IonSelectOption>
          </IonSelect>
          <IonSelect
            value={sortBy}
            onIonChange={e => setSortBy(e.detail.value)}
            placeholder="Sort by"
            interface="popover"
          >
            <IonSelectOption value="lastSeen">Last Seen</IonSelectOption>
            <IonSelectOption value="epc">EPC</IonSelectOption>
            <IonSelectOption value="status">Status</IonSelectOption>
            <IonSelectOption value="location">Location</IonSelectOption>
            <IonSelectOption value="item">Item</IonSelectOption>
          </IonSelect>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isLoading ? (
          <div className="ion-padding">Loading...</div>
        ) : (
          <IonList>
            {filteredTags.map(tag => (
              <IonItem key={tag._id}>
                <IonLabel>
                  <h2>EPC: {tag.epc}</h2>
                  <p>Item: {tag.item?.name || 'Unknown Item'}</p>
                  <p>Location: {tag.location}</p>
                  <p>Last Seen: {new Date(tag.lastSeen).toLocaleString()}</p>
                </IonLabel>
                <IonChip color={getStatusColor(tag.status)}>
                  {tag.status}
                </IonChip>
                <IonButtons slot="end">
                  <IonButton onClick={() => {
                    const tagToEdit = {
                      ...tag,
                      lastSeen: tag.lastSeen || new Date().toISOString()
                    };
                    setEditingTag(tagToEdit);
                    setShowEditModal(true);
                  }}>
                    <IonIcon slot="icon-only" icon={create} />
                  </IonButton>
                  <IonButton onClick={() => handleDeleteTag(tag._id)}>
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
            <IonTitle>Add New Tag</IonTitle>
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
            label="EPC"
            labelPlacement="floating"
            value={newTag.epc}
            onIonChange={e => setNewTag({ ...newTag, epc: e.detail.value! })}
            placeholder="Enter tag EPC"
          />
          <IonSelect
            label="Item"
            labelPlacement="floating"
            value={newTag.item}
            onIonChange={e => setNewTag({ ...newTag, item: e.detail.value })}
            interface="popover"
          >
            {items.map(item => (
              <IonSelectOption key={item._id} value={item._id}>
                {item.name}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonSelect
            label="Status"
            labelPlacement="floating"
            value={newTag.status}
            onIonChange={e => setNewTag({ ...newTag, status: e.detail.value })}
            interface="popover"
          >
            <IonSelectOption value="inStock">In Stock</IonSelectOption>
            <IonSelectOption value="inTransit">In Transit</IonSelectOption>
            <IonSelectOption value="delivered">Delivered</IonSelectOption>
            <IonSelectOption value="lost">Lost</IonSelectOption>
          </IonSelect>
          <IonInput
            label="Location"
            labelPlacement="floating"
            value={newTag.location}
            onIonChange={e => setNewTag({ ...newTag, location: e.detail.value! })}
            placeholder="Enter location"
          />
          <IonInput
            label="Last Seen"
            labelPlacement="floating"
            type="datetime-local"
            value={newTag.lastSeen}
            onIonChange={e => setNewTag({ ...newTag, lastSeen: e.detail.value! })}
          />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" onClick={handleAddTag}>
              Add Tag
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
            <IonTitle>Edit Tag</IonTitle>
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
            label="EPC"
            labelPlacement="floating"
            value={editingTag?.epc}
            onIonChange={e => editingTag && setEditingTag({ ...editingTag, epc: e.detail.value! })}
            placeholder="Enter tag EPC"
          />
          <IonSelect
            label="Item"
            labelPlacement="floating"
            value={editingTag?.item?._id}
            onIonChange={e => {
              if (editingTag) {
                const selectedItem = items.find(item => item._id === e.detail.value);
                setEditingTag({
                  ...editingTag,
                  item: selectedItem ? {
                    _id: selectedItem._id,
                    name: selectedItem.name,
                    description: selectedItem.description
                  } : editingTag.item
                });
              }
            }}
            interface="popover"
          >
            {items.map(item => (
              <IonSelectOption key={item._id} value={item._id}>
                {item.name}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonSelect
            label="Status"
            labelPlacement="floating"
            value={editingTag?.status}
            onIonChange={e => editingTag && setEditingTag({ ...editingTag, status: e.detail.value })}
            interface="popover"
          >
            <IonSelectOption value="inStock">In Stock</IonSelectOption>
            <IonSelectOption value="inTransit">In Transit</IonSelectOption>
            <IonSelectOption value="delivered">Delivered</IonSelectOption>
            <IonSelectOption value="lost">Lost</IonSelectOption>
          </IonSelect>
          <IonInput
            label="Location"
            labelPlacement="floating"
            value={editingTag?.location}
            onIonChange={e => editingTag && setEditingTag({ ...editingTag, location: e.detail.value! })}
            placeholder="Enter location"
          />
          <IonInput
            label="Last Seen"
            labelPlacement="floating"
            type="datetime-local"
            value={editingTag?.lastSeen ? new Date(editingTag.lastSeen).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
            onIonChange={e => editingTag && setEditingTag({ ...editingTag, lastSeen: e.detail.value! })}
          />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" onClick={handleEditTag}>
              Save Changes
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default TagList; 