// connect web socket to Pie Chart

export function connectWebSocketToPieChart(userId, serviceName, onMessage, onError, onClose) {
  const ws = new WebSocket(`ws://localhost:3000/getMetricData?userId=${userId}&serviceName=${serviceName}&metricName=totalTasks`);
      //ws://localhost:3000/getMetricData?userId=1&serviceName=v1&metricName=totalTasks  
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // ตรวจสอบว่า data มี error หรือไม่
      if (data.error) {
        onError(new Error(data.error));
      } else {
        onMessage(data);
      }
    };
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
  
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      if (onClose) onClose(event);
    };
  
    return ws;
  }
  
  