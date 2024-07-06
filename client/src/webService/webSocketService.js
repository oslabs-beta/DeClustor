export function connectWebSocket(userId, serviceName, metricNames, onMessage, onError, onClose) {
    const ws = new WebSocket(`ws://localhost:3000/getMetricData?userId=${userId}&serviceName=${serviceName}&metricName=${metricNames.join(',')}`);
  
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
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
  