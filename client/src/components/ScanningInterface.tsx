import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonInput,
} from '@ionic/react';
import { scan, refresh, checkmark, close, play, stop } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

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

interface ScanResult {
  tag: Tag;
  timestamp: string;
  status: 'new' | 'existing';
}

const ScanningInterface: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    newTags: 0,
    existingTags: 0,
    lastScanTime: '',
  });
  const [scanMode, setScanMode] = useState<'mock' | 'real'>('mock');
  const [isLoading, setIsLoading] = useState(true);
  const [mockLocation, setMockLocation] = useState('Warehouse A');
  const [customLocation, setCustomLocation] = useState('');
  const [mockStatus, setMockStatus] = useState<Tag['status']>('inStock');
  const [mockScanInterval, setMockScanInterval] = useState<NodeJS.Timeout | null>(null);

  const mockLocations = [
    'Warehouse A',
    'Warehouse B',
    'Loading Dock',
    'Shipping Area',
    'Receiving Area',
    'Storage Room 1',
    'Storage Room 2',
    'Custom'
  ];

  const mockStatuses: Tag['status'][] = [
    'inStock',
    'inTransit',
    'delivered',
    'lost'
  ];

  useEffect(() => {
    fetchAllTags();
    return () => {
      if (mockScanInterval) {
        clearInterval(mockScanInterval);
      }
    };
  }, []);

  const fetchAllTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tags`);
      setAllTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mockScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Pick a random tag from the database
    const randomIndex = Math.floor(Math.random() * allTags.length);
    const scannedTag = allTags[randomIndex];
    
    if (scannedTag) {
      const currentTime = new Date().toISOString();
      const location = mockLocation === 'Custom' ? customLocation : mockLocation;
      
      try {
        // Update the tag
        const response = await axios.patch(`${API_URL}/api/tags/${scannedTag._id}`, {
          lastSeen: currentTime,
          location: location,
          status: mockStatus
        });
        
        // Create scan result with the updated tag data
        const scanResult: ScanResult = {
          tag: {
            ...scannedTag,
            lastSeen: currentTime,
            location: location,
            status: mockStatus
          },
          timestamp: currentTime,
          status: 'existing'
        };

        setScanResults(prev => [scanResult, ...prev]);
        setStats(prev => ({
          totalScans: prev.totalScans + 1,
          newTags: prev.newTags,
          existingTags: prev.existingTags + 1,
          lastScanTime: new Date().toLocaleTimeString()
        }));

        // Update the allTags state to keep it in sync
        setAllTags(prev => prev.map(tag => 
          tag._id === scannedTag._id ? {
            ...tag,
            lastSeen: currentTime,
            location: location,
            status: mockStatus
          } : tag
        ));
      } catch (error) {
        console.error('Error updating scanned tag:', error);
      }
    }
    
    setIsScanning(false);
  };

  const startContinuousMockScan = () => {
    if (mockScanInterval) {
      clearInterval(mockScanInterval);
      setMockScanInterval(null);
      return;
    }

    const interval = setInterval(() => {
      if (allTags.length > 0) {
        mockScan();
      }
    }, 2000); // Scan every 2 seconds

    setMockScanInterval(interval);
  };

  const realScan = async () => {
    // This will be implemented when we have actual RFID hardware
    console.log('Real scanning not yet implemented');
  };

  const handleScan = async () => {
    if (scanMode === 'mock') {
      await mockScan();
    } else {
      await realScan();
    }
  };

  const updateTagStatus = async (tagId: string, newStatus: Tag['status']) => {
    try {
      await axios.patch(`${API_URL}/api/tags/${tagId}`, {
        status: newStatus,
        lastSeen: new Date().toISOString()
      });
      
      // Update the scan results
      setScanResults(prev => prev.map(result => 
        result.tag._id === tagId 
          ? { ...result, tag: { ...result.tag, status: newStatus } }
          : result
      ));
      
      // Update all tags
      setAllTags(prev => prev.map(tag => 
        tag._id === tagId 
          ? { ...tag, status: newStatus, lastSeen: new Date().toISOString() }
          : tag
      ));
    } catch (error) {
      console.error('Error updating tag status:', error);
    }
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
          <IonTitle>Scanning Interface</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonSelect
                value={scanMode}
                onIonChange={e => setScanMode(e.detail.value)}
                interface="popover"
              >
                <IonSelectOption value="mock">Mock Scanning</IonSelectOption>
                <IonSelectOption value="real">Real Scanning (Unimplemented)</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>

          {scanMode === 'mock' && (
            <>
              <IonRow>
                <IonCol size="12">
                  <IonSelect
                    value={mockLocation}
                    onIonChange={e => setMockLocation(e.detail.value)}
                    interface="popover"
                    label="Mock Location"
                    labelPlacement="floating"
                  >
                    {mockLocations.map(location => (
                      <IonSelectOption key={location} value={location}>
                        {location}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonCol>
              </IonRow>
              {mockLocation === 'Custom' && (
                <IonRow>
                  <IonCol size="12">
                    <IonInput
                      value={customLocation}
                      onIonChange={e => setCustomLocation(e.detail.value || '')}
                      placeholder="Enter custom location"
                      label="Custom Location"
                      labelPlacement="floating"
                    />
                  </IonCol>
                </IonRow>
              )}
              <IonRow>
                <IonCol size="12">
                  <IonSelect
                    value={mockStatus}
                    onIonChange={e => setMockStatus(e.detail.value)}
                    interface="popover"
                    label="Mock Status"
                    labelPlacement="floating"
                  >
                    {mockStatuses.map(status => (
                      <IonSelectOption key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonText color="medium">
                    <p>Mock scanning will randomly select tags from your database and update their location, status, and last seen time.</p>
                  </IonText>
                </IonCol>
              </IonRow>
            </>
          )}

          <IonRow>
            <IonCol size="12">
              <IonButton
                expand="block"
                onClick={handleScan}
                disabled={isScanning || (scanMode === 'mock' && allTags.length === 0)}
              >
                <IonIcon slot="start" icon={scan} />
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </IonButton>
            </IonCol>
          </IonRow>

          {scanMode === 'mock' && (
            <IonRow>
              <IonCol size="12">
                <IonButton
                  expand="block"
                  onClick={startContinuousMockScan}
                  color={mockScanInterval ? 'danger' : 'success'}
                >
                  <IonIcon slot="start" icon={mockScanInterval ? stop : play} />
                  {mockScanInterval ? 'Stop Continuous Scan' : 'Start Continuous Scan'}
                </IonButton>
              </IonCol>
            </IonRow>
          )}

          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent>
                  <h2>Scan Statistics</h2>
                  <p>Total Scans: {stats.totalScans}</p>
                  <p>New Tags: {stats.newTags}</p>
                  <p>Existing Tags: {stats.existingTags}</p>
                  <p>Last Scan: {stats.lastScanTime || 'Never'}</p>
                  <p>Available Tags: {allTags.length}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent>
                  <h2>Quick Actions</h2>
                  <IonButton expand="block" onClick={fetchAllTags}>
                    <IonIcon slot="start" icon={refresh} />
                    Refresh Tags
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <h2>Recent Scans</h2>
              <IonList>
                {scanResults.map((result, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      <h2>EPC: {result.tag.epc}</h2>
                      <p>Item: {result.tag.item?.name || 'Unknown Item'}</p>
                      <p>Description: {result.tag.item?.description || 'No description'}</p>
                      <p>Location: {result.tag.location}</p>
                      <p>Status: {result.tag.status}</p>
                      <p>Last Seen: {new Date(result.tag.lastSeen).toLocaleString()}</p>
                      <IonChip color={result.status === 'new' ? 'success' : 'primary'}>
                        {result.status === 'new' ? 'New Tag' : 'Existing Tag'}
                      </IonChip>
                    </IonLabel>
                    <IonButtons slot="end">
                      <IonSelect
                        value={result.tag.status}
                        onIonChange={e => updateTagStatus(result.tag._id, e.detail.value)}
                        interface="popover"
                      >
                        <IonSelectOption value="inStock">In Stock</IonSelectOption>
                        <IonSelectOption value="inTransit">In Transit</IonSelectOption>
                        <IonSelectOption value="delivered">Delivered</IonSelectOption>
                        <IonSelectOption value="lost">Lost</IonSelectOption>
                      </IonSelect>
                    </IonButtons>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ScanningInterface; 