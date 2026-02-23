import { MODELS, SYSTEM_INSTRUCTION } from '../constants';


const API_PROXY_URL = '/suvidha-ai-assistant/api-proxy/api-proxy';

async function proxyFetch(originalUrl: string, body: object, isStreaming: boolean) {
  const response = await fetch(API_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-proxy': 'local-vertex-ai-app',
    },
    body: JSON.stringify({
      originalUrl,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  if (isStreaming) {
    return response.body;
  } else {
    return response.json();
  }
}

export const generateTextResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const originalUrl = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODELS.TEXT}:streamGenerateContent`;
  const body = {
    contents: [
      ...history,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    systemInstruction: {
      role: 'system',
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
  };

  const response = await proxyFetch(originalUrl, body, true);
  
  if (!response) {
    throw new Error("Empty response from server");
  }

  const reader = response.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
    }
    done = streamDone;
  }
  
  // The response from the proxy is a stream of JSON objects.
  // We need to parse each line as a JSON object and extract the text.
  const lines = result.split('\n');
  let fullText = '';
  for (const line of lines) {
    if (line.startsWith('data:')) {
      try {
        const json = JSON.parse(line.substring(5));
        if (json.candidates && json.candidates[0].content.parts[0].text) {
          fullText += json.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }

  return fullText;
};

export const generateImageResponse = async (prompt: string): Promise<string> => {
  const originalUrl = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODELS.IMAGE}:predict`;
  const body = {
    instances: [
      {
        prompt: prompt,
      },
    ],
    parameters: {
      sampleCount: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  };
  const response = await proxyFetch(originalUrl, body, false);
  if (response.predictions && response.predictions.length > 0) {
    const base64ImageBytes = response.predictions[0].bytesBase64Encoded;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }
  throw new Error('No image generated');
};

export const generateVideoResponse = async (prompt: string): Promise<string> => {
  const originalUrl = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODELS.VIDEO}:predict`;
  const body = {
    instances: [
      {
        prompt: prompt,
      },
    ],
    parameters: {
      sampleCount: 1,
    },
  };
  // This is a long running operation, so we don't handle the polling here.
  // The backend proxy doesn't support long running operations yet.
  // This will likely fail.
  const response = await proxyFetch(originalUrl, body, false);
  // The response will be an operation. We need to poll for the result.
  // This is not implemented in the backend proxy.
  // Returning a placeholder for now.
  return "Video generation is not fully supported in this version.";
};
