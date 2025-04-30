# Tag Tracker - System Design Document

## Overview
A comprehensive RFID-based inventory tracking system with simulation capabilities and future real RFID scanner integration.

## Pages & Functionality

### 1. Dashboard
- Overview of total tags
- Status distribution (inStock, inTransit, delivered, lost)
- Recent activity feed
- Quick actions (scan tag, add tag)

### 2. Tag Management
- List of all tags with filtering and sorting
- Add/Edit/Delete tags
- Bulk operations
- Tag details view
- Status history

### 3. Scanning Interface
- Real-time scanning simulation
- Manual tag entry option
- Location selection
- Status update on scan
- Batch scanning mode

### 4. Analytics
- Tag movement patterns
- Status distribution charts
- Location heat maps
- Time-based analytics
- Export functionality

### 5. Settings
- User preferences
- System configuration
- API keys (for future RFID integration)
- Notification settings

## 💾 Database Schema

### Tag Schema
```javascript
{
  id: String,          // RFID tag ID
  name: String,        // Human-readable name
  description: String, // Optional description
  status: String,      // inStock, inTransit, delivered, lost
  location: String,    // Current location
  lastSeen: Date,      // Last scan timestamp
  history: [{          // Movement history
    timestamp: Date,
    location: String,
    status: String,
    scannedBy: String
  }],
  metadata: {          // Additional tag info
    category: String,
    value: Number,
    owner: String,
    notes: String
  }
}
```

### User Schema (for future auth)
```javascript
{
  username: String,
  password: String,
  role: String,
  preferences: Object
}
```

### Location Schema
```javascript
{
  id: String,
  name: String,
  type: String,        // warehouse, store, transit, etc.
  coordinates: Object, // For future mapping
  capacity: Number
}
```

## 🔌 RFID Integration Preparation

### Scanner Interface
```typescript
interface RFIDScanner {
  startScanning(): Promise<void>;
  stopScanning(): Promise<void>;
  onTagDetected(callback: (tagId: string) => void): void;
  getScannerInfo(): Promise<ScannerInfo>;
}
```

### Mock Scanner Implementation
```typescript
class MockRFIDScanner implements RFIDScanner {
  private interval: NodeJS.Timeout;
  
  startScanning() {
    this.interval = setInterval(() => {
      // Simulate random tag detection
      const mockTagId = `TAG-${Math.random().toString(36).substr(2, 9)}`;
      this.onTagDetected(mockTagId);
    }, 2000);
  }
  
  // ... implement other methods
}
```

### Scanner Factory
```typescript
class ScannerFactory {
  static createScanner(type: 'mock' | 'real'): RFIDScanner {
    switch(type) {
      case 'mock':
        return new MockRFIDScanner();
      case 'real':
        // Future implementation for real scanner
        throw new Error('Real scanner not implemented yet');
      default:
        throw new Error('Invalid scanner type');
    }
  }
}
```

## Implementation Strategy

### Phase 1: Core Functionality
- Basic tag management
- Mock scanning interface
- Simple dashboard
- Basic analytics

### Phase 2: Enhanced Features
- Advanced filtering and search
- Batch operations
- Detailed analytics
- User management

### Phase 3: RFID Integration
- Real scanner support
- Real-time updates
- Advanced location tracking
- Mobile app support

## 🔄 Real-time Updates
Using Socket.IO for:
- Tag status changes
- New scans
- Location updates
- System notifications

## Mobile Considerations
- Responsive layouts
- Touch-friendly interfaces
- Offline capabilities
- Camera integration (for QR/barcode fallback)

## Next Steps
1. Implement core tag management system
2. Create mock scanning interface
3. Design dashboard layout
4. Set up real-time updates
5. Add analytics features 