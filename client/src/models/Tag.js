class Tag {
  constructor(id, epc, location, status, lastScanned, metadata = {}) {
    this.id = id;
    this.epc = epc; // Electronic Product Code (RFID unique identifier)
    this.location = location;
    this.status = status; // 'in_stock', 'in_transit', 'delivered', 'lost'
    this.lastScanned = lastScanned;
    this.metadata = metadata; // Additional tag information
  }

  static createFromScan(epc, location) {
    return new Tag(
      Math.random().toString(36).substr(2, 9), // Generate a unique ID
      epc,
      location,
      'in_stock',
      new Date(),
      {
        scanCount: 1,
        firstSeen: new Date()
      }
    );
  }
}

export default Tag; 