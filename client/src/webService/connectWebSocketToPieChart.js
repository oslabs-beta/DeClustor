// connect web socket to Pie Chart
export function connectWebSocketToPieChart(userId, accountName, region, clusterName, serviceName, onMessage, onError, onClose) {
  // Create a new WebSocket connection with the specified parameters
  const ws = new WebSocket(`ws://localhost:3000/getMetricData?userId=${userId}&accountName=${accountName}&region=${region}&clusterName=${clusterName}&serviceName=${serviceName}&metricName=totalTasks`); 
  // Event listener for when the WebSocket connection is opened  
  ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
  
    // Event listener for receiving messages from the WebSocket
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Check if the received data contains an error
      if (data.error) {
        onError(new Error(data.error));
      } else {
        onMessage(data);
      }
    };
  
    // Event listener for WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
  
    // Event listener for when the WebSocket connection is closed
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      if (onClose) onClose(event);
    };
  
    return ws;
  }
  
  
