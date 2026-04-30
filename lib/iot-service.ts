/**
 * IoT Service
 * Connects to MQTT broker for smart studio devices
 * Uses mqtt library (MIT)
 */

import mqtt from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

let client: mqtt.MqttClient | null = null;

export function connectIoT(): mqtt.MqttClient {
  if (client && client.connected) return client;
  
  client = mqtt.connect(brokerUrl);
  
  client.on('connect', () => {
    console.log('Connected to IoT broker');
    // Subscribe to studio topics
    client?.subscribe('studio/+/status');
    client?.subscribe('studio/+/sensors');
  });
  
  client.on('message', (topic: string, message: Buffer) => {
    console.log(`IoT Message [${topic}]:`, message.toString());
    // Handle device status updates
    // Could store in database or emit via WebSocket
  });
  
  client.on('error', (err: Error) => {
    console.error('IoT connection error:', err);
  });
  
  return client;
}

export function sendCommand(deviceId: string, command: string): void {
  if (!client || !client.connected) {
    connectIoT();
  }
  client?.publish(`studio/${deviceId}/command`, command);
}

export function getStudioStatus() {
  // In production: fetch from database or MQTT
  return {
    devices: [
      { id: 'light-1', name: 'Studio Light', type: 'light', online: true, status: 'on' },
      { id: 'cam-1', name: 'Camera A', type: 'camera', online: true, status: 'recording' },
      { id: 'sensor-1', name: 'Temp Sensor', type: 'sensor', online: true, temp: 24.5 },
    ]
  };
}
