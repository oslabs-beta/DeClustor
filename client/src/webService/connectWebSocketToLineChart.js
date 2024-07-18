// connet web socket to the Line chart

export function connectWebSocketToLineChart(userId, serviceName, metricNames, onMessage, onError, onClose) {
  // change with redux 
  const ws = new WebSocket(`ws://localhost:3000/getMetricData?userId=${userId}&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=${serviceName}&metricName=${metricNames.join(',')}`);
  //ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=CPUUtilization

  ws.onopen = () => {
    console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
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
