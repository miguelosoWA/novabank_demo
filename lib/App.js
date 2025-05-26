import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import { DID_CONFIG } from './config';

function App() {
  const [message, setMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'
  
  // D-ID streaming states (WebSocket-based clips)
  const [streamId, setStreamId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  // Stream warmup setting (like reference implementation)
  const stream_warmup = true;
  const [isStreamReady, setIsStreamReady] = useState(!stream_warmup);
  const peerConnectionRef = useRef(null);
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const pcDataChannelRef = useRef(null);
  
  // WebSocket and streaming state
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [lastBytesReceived, setLastBytesReceived] = useState(0);
  const statsIntervalIdRef = useRef(null);

  // D-ID Talks states (keeping existing REST implementation)
  const [talksConnectionStatus, setTalksConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'
  const [talksStreamId, setTalksStreamId] = useState(null);
  const [talksSessionId, setTalksSessionId] = useState(null);
  const [isTalksStreamReady, setIsTalksStreamReady] = useState(false);
  const talksPeerConnectionRef = useRef(null);
  const talksVideoRef = useRef(null);

  // Presenter configuration based on loaded API config
  const getPresenterConfig = () => {
    const presenterInputByService = {
      talks: {
        source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Emma_f/v1_image.jpeg',
      },
      clips: {
        presenter_id: DID_CONFIG.PRESENTER_ID,
        driver_id: DID_CONFIG.DRIVER_ID,
      },
    };
    
    return presenterInputByService[DID_CONFIG.SERVICE] || presenterInputByService.clips;
  };

  // Utility function for retries
  const fetchWithRetries = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  // WebSocket helper functions
  const connectToWebSocket = (url, token) => {
    return new Promise((resolve, reject) => {
      // For D-ID WebSocket API, the authorization should be passed as a query parameter
      // The token should be base64 encoded API credentials
      const wsUrl = `${url}?authorization=Basic ${token}`;
      console.log('Attempting WebSocket connection to:', wsUrl.replace(token, '***'));
      
      const ws = new WebSocket(wsUrl);
      let connectionTimeout;

      // Set a timeout for the connection
      connectionTimeout = setTimeout(() => {
        console.error('WebSocket connection timeout');
        ws.close();
        reject(new Error('WebSocket connection timeout after 10 seconds'));
      }, 20000);

      ws.onopen = () => {
        console.log('WebSocket connection opened successfully.');
        clearTimeout(connectionTimeout);
        resolve(ws);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        clearTimeout(connectionTimeout);
        reject(new Error(`WebSocket connection failed: ${err.message || 'Connection error'}`));
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed.', 'Code:', event.code, 'Reason:', event.reason);
        clearTimeout(connectionTimeout);
        
        // Handle different close codes
        if (event.code === 1006) {
          reject(new Error('WebSocket connection closed abnormally. Check your API key and network connection.'));
        } else if (event.code === 1002) {
          reject(new Error('WebSocket protocol error. Check API endpoint URL.'));
        } else if (event.code === 1003) {
          reject(new Error('WebSocket data type error.'));
        } else if (event.code === 1011) {
          reject(new Error('WebSocket server error. Check your API credentials.'));
        } else if (event.code === 4000 || event.code === 4001) {
          reject(new Error('Authentication failed. Check your API key format.'));
        } else if (event.code !== 1000) {
          reject(new Error(`WebSocket closed with code ${event.code}: ${event.reason || 'Unknown reason'}`));
        }
      };
    });
  };

  const sendMessage = (ws, message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  };

  // WebSocket-based stream creation
  const createStream = async () => {
    if (peerConnectionRef.current && peerConnectionRef.current.connectionState === 'connected') {
      return;
    }

    stopAllStreams();
    closePC();
    setConnectionStatus('connecting');

    try {
      console.log('=== WebSocket Connection Debug Info ===');
      console.log('WebSocket URL:', DID_CONFIG.WEBSOCKET_URL);
      console.log('API Key length:', DID_CONFIG.API_KEY?.length);
      console.log('API Key format check:', DID_CONFIG.API_KEY?.includes(':') ? 'Contains colon (good)' : 'Missing colon (bad)');
      console.log('Service:', DID_CONFIG.SERVICE);
      console.log('Presenter Config:', getPresenterConfig());
      
      // Validate configuration
      if (!DID_CONFIG.API_KEY) {
        throw new Error('API key is missing in configuration');
      }
      if (!DID_CONFIG.WEBSOCKET_URL) {
        throw new Error('WebSocket URL is missing in configuration');
      }
      if (!DID_CONFIG.API_KEY.includes(':')) {
        console.warn('API key format might be incorrect - should contain username:password');
      }
      
      console.log('Connecting to WebSocket...');
      
      // Step 1: Connect to WebSocket
      const ws = await connectToWebSocket(DID_CONFIG.WEBSOCKET_URL, DID_CONFIG.API_KEY);
      wsRef.current = ws;

      console.log('WebSocket connected successfully, sending init-stream message...');

      // Step 2: Send "init-stream" message to WebSocket
      const startStreamMessage = {
        type: 'init-stream',
        payload: {
          ...getPresenterConfig(),
          presenter_type: 'clip',
        },
      };
      
      console.log('Sending init-stream message:', startStreamMessage);
      sendMessage(ws, startStreamMessage);

      // Step 3: Handle WebSocket responses by message type
      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        switch (data.messageType) {
          case 'init-stream':
            const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = data;
            setStreamId(newStreamId);
            setSessionId(newSessionId);
            console.log('init-stream', newStreamId, newSessionId);
            try {
              const sessionClientAnswer = await createPeerConnection(offer, iceServers);
              // Step 4: Send SDP answer to WebSocket
              const sdpMessage = {
                type: 'sdp',
                payload: {
                  answer: sessionClientAnswer,
                  session_id: newSessionId,
                  presenter_type: 'clip',
                },
              };
              sendMessage(ws, sdpMessage);
            } catch (e) {
              console.error('Error during streaming setup', e);
              stopAllStreams();
              closePC();
              setConnectionStatus('disconnected');
              return;
            }
            break;

          case 'sdp':
            console.log('SDP message received:', event.data);
            break;

          case 'delete-stream':
            console.log('Stream deleted:', event.data);
            break;
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error after connection:', error);
        setConnectionStatus('disconnected');
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed after connection:', event.code, event.reason);
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.error('Failed to connect and set up stream:', error);
      setConnectionStatus('disconnected');
      alert(`Connection failed: ${error.message}\n\nPlease check:\n1. Your API key is correct\n2. You have sufficient credits\n3. Your presenter and driver IDs are valid\n4. Your network connection`);
    }
  };

  // WebSocket-based peer connection creation
  const createPeerConnection = async (offer, iceServers) => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection({ iceServers });
      pcDataChannelRef.current = peerConnectionRef.current.createDataChannel('JanusDataChannel');
      
      // Event listeners
      peerConnectionRef.current.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
      peerConnectionRef.current.addEventListener('icecandidate', onIceCandidate, true);
      peerConnectionRef.current.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
      peerConnectionRef.current.addEventListener('connectionstatechange', onConnectionStateChange, true);
      peerConnectionRef.current.addEventListener('signalingstatechange', onSignalingStateChange, true);
      peerConnectionRef.current.addEventListener('track', onTrack, true);
      pcDataChannelRef.current.addEventListener('message', onStreamEvent, true);
      
      console.log('🎥 Peer connection created with track event listener');
    }

    await peerConnectionRef.current.setRemoteDescription(offer);
    console.log('set remote sdp OK');

    const sessionClientAnswer = await peerConnectionRef.current.createAnswer();
    console.log('create local sdp OK');

    await peerConnectionRef.current.setLocalDescription(sessionClientAnswer);
    console.log('set local sdp OK');

    // Add backup mechanism to check for receivers after connection is established
    setTimeout(() => {
      if (peerConnectionRef.current) {
        const receivers = peerConnectionRef.current.getReceivers();
        console.log('🎥 BACKUP: Checking receivers after connection:', receivers.length);
        
        receivers.forEach((receiver, index) => {
          if (receiver.track) {
            console.log(`🎥 BACKUP: Receiver ${index} has track:`, {
              kind: receiver.track.kind,
              readyState: receiver.track.readyState,
              enabled: receiver.track.enabled
            });
            
            // If we have video track but no track event was fired, manually trigger setup
            if (receiver.track.kind === 'video' && receiver.track.readyState === 'live') {
              console.log('🎥 BACKUP: Manually creating stream from receivers');
              const tracks = receivers.map(r => r.track).filter(t => t && t.readyState === 'live');
              if (tracks.length > 0) {
                const manualStream = new MediaStream(tracks);
                console.log('🎥 BACKUP: Manual stream created:', manualStream.id);
                setStreamVideoElement(manualStream);
                
                // Start manual stats monitoring if not already started
                if (!statsIntervalIdRef.current) {
                  console.log('🎥 BACKUP: Starting manual stats monitoring');
                  const videoTrack = tracks.find(t => t.kind === 'video');
                  if (videoTrack) {
                    // Trigger the track event manually
                    onTrack({ track: videoTrack, streams: [manualStream] });
                  }
                }
              }
            }
          }
        });
      }
    }, 3000); // Give some time for the connection to establish

    return sessionClientAnswer;
  };

  // ICE candidate handling for WebSocket
  const onIceCandidate = useCallback((event) => {
    console.log('onIceCandidate', event);
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
      sendMessage(wsRef.current, {
        type: 'ice',
        payload: {
          session_id: sessionId,
          candidate,
          sdpMid,
          sdpMLineIndex,
        },
      });
    } else {
      sendMessage(wsRef.current, {
        type: 'ice',
        payload: {
          stream_id: streamId,
          session_id: sessionId,
          presenter_type: 'clip',
        },
      });
    }
  }, [sessionId, streamId]);

  // Event handlers for WebSocket implementation
  const onIceGatheringStateChange = () => {
    console.log('ICE gathering state:', peerConnectionRef.current?.iceGatheringState);
  };

  const onIceConnectionStateChange = () => {
    const state = peerConnectionRef.current?.iceConnectionState;
    console.log('🔗 ICE connection state:', state);
    
    if (state === 'connected' || state === 'completed') {
      console.log('🔗 Setting stream as ready and connection as connected');
      setConnectionStatus('connected');
      console.log('🔗 WebRTC connection established successfully');
      
      // Fallback mechanism for stream ready
      setTimeout(() => {
        if (!isStreamReady) {
          console.log('forcing stream/ready');
          setIsStreamReady(true);
        }
      }, 5000);
      
    } else if (state === 'failed' || state === 'disconnected') {
      console.log('🔗 Connection failed or disconnected');
      setConnectionStatus('disconnected');
      setIsStreamReady(false);
      stopAllStreams();
      closePC();
    }
  };

  const onConnectionStateChange = () => {
    const state = peerConnectionRef.current?.connectionState;
    console.log('Connection state:', state);
    
    if (state === 'connected') {
      console.log('🔗 WebRTC connected - ready for streaming');
    }
  };

  const onSignalingStateChange = () => {
    console.log('Signaling state:', peerConnectionRef.current?.signalingState);
  };

  // Enhanced track handling with video status management (like reference)
  const onTrack = (event) => {
    console.log('🎥 ===== TRACK EVENT RECEIVED =====');
    console.log('🎥 Received track event:', event);
    console.log('🎥 Track details:', {
      track: event.track,
      kind: event.track?.kind,
      readyState: event.track?.readyState,
      enabled: event.track?.enabled,
      muted: event.track?.muted,
      streams: event.streams?.length
    });
    
    if (!event.track) {
      console.log('🎥 No track in event, returning');
      return;
    }

    // Immediately set up the video element if we have streams like reference implementation
    if (event.streams && event.streams[0]) {
      const stream = event.streams[0];
      console.log('🎥 Setting up stream immediately from track event:', {
        streamId: stream.id,
        active: stream.active,
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length
      });
      
      // Set the video element immediately
      setStreamVideoElement(stream);
    }

    // Set up video status monitoring like reference implementation
    if (statsIntervalIdRef.current) {
      clearInterval(statsIntervalIdRef.current);
      console.log('🎥 Cleared existing stats interval');
    }

    console.log('🎥 Starting stats monitoring interval...');
    statsIntervalIdRef.current = setInterval(async () => {
      if (peerConnectionRef.current) {
        const stats = await peerConnectionRef.current.getStats(event.track);
        stats.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            // Just log stats for debugging, don't change video visibility
            // This prevents blinking between messages
            console.log('🎥 Video stats (monitoring only):', { 
              bytesReceived: report.bytesReceived, 
              lastBytes: lastBytesReceived, 
              bytesIncreasing: report.bytesReceived > lastBytesReceived,
              currentVideoIsPlaying: videoIsPlaying,
              isStreamReady
            });

            setLastBytesReceived(report.bytesReceived);
          }
        });
      } else {
        console.log('🎥 No peer connection for stats');
      }
    }, 500);
  };

  // Video status change handler (simplified)
  const onVideoStatusChange = (videoIsPlaying, stream) => {
    console.log('🎥 onVideoStatusChange called:', { videoIsPlaying, isStreamReady, hasStream: !!stream });
    
    if (videoIsPlaying && stream) {
      console.log('🎥 Stream is playing - setting up video element');
      setStreamVideoElement(stream);
    } else {
      console.log('🎥 Stream not playing');
    }
    
    console.log('🎥 Video status:', videoIsPlaying ? 'streaming' : 'empty');
  };

  // Stream event handler for data channel messages (like reference)
  const onStreamEvent = (message) => {
    console.log('📡 Data channel message received:', message.data);
    
    if (pcDataChannelRef.current && pcDataChannelRef.current.readyState === 'open') {
      const [event, _] = message.data.split(':');
      console.log('Stream event:', event);

      let status;
      switch (event) {
        case 'stream/started':
          console.log('Stream started - avatar will start speaking');
          status = 'started';
          
          // Ensure video element is set up (no need to change visibility)
          console.log('🎥 Stream started, checking video setup');
          if (!videoRef.current?.srcObject && peerConnectionRef.current) {
            console.log('🎥 No video setup yet, creating emergency stream from tracks');
            const receivers = peerConnectionRef.current.getReceivers();
            const tracks = receivers.map(r => r.track).filter(t => t && t.readyState === 'live');
            if (tracks.length > 0) {
              console.log('🎥 Creating emergency stream from tracks');
              const emergencyStream = new MediaStream(tracks);
              setStreamVideoElement(emergencyStream);
            }
          }
          break;
        case 'stream/done':
          console.log('Stream done - avatar finished speaking');
          status = 'done';
          // Keep video visible - don't hide it when done
          break;
        case 'stream/ready':
          status = 'ready';
          // Set stream ready after a short delay
          setTimeout(() => {
            console.log('stream/ready - setting stream ready to true');
            setIsStreamReady(true);
          }, 1000);
          break;
        case 'stream/error':
          console.log('Stream error');
          status = 'error';
          break;
        default:
          status = 'dont-care';
          console.log('Other stream event:', event);
          break;
      }
    }
  };

  // Set video element for streaming
  const setStreamVideoElement = (stream) => {
    if (!stream || !videoRef.current) {
      console.log('🎥 setStreamVideoElement: missing stream or videoRef', { stream: !!stream, videoRef: !!videoRef.current });
      return;
    }

    console.log('🎥 Setting video srcObject:', {
      streamId: stream.id,
      active: stream.active,
      videoTracks: stream.getVideoTracks().length,
      audioTracks: stream.getAudioTracks().length,
      currentSrcObject: !!videoRef.current.srcObject
    });

    videoRef.current.srcObject = stream;
    videoRef.current.loop = false;
    videoRef.current.muted = false; // Ensure audio is enabled
    
    // Force play
    videoRef.current.play().then(() => {
      console.log('🎥 Video playing successfully');
    }).catch((e) => {
      console.log('🎥 Video autoplay failed, trying muted:', e);
      videoRef.current.muted = true;
      return videoRef.current.play();
    }).then(() => {
      console.log('🎥 Video playing (muted)');
      // Try to unmute after a delay
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          console.log('🎥 Video unmuted after delay');
        }
      }, 1000);
    }).catch((e) => console.error('🎥 Video play error:', e));
  };

  // Play idle video - improved version with proper file handling
  const playIdleVideo = () => {
    const idleVideoElement = document.getElementById('idle-video-element');
    if (idleVideoElement) {
      // Use different idle videos based on the service type
      const idleVideoSrc = DID_CONFIG.SERVICE === 'clips' ? 'alyssa_v2_idle.mp4' : 'emma_idle.mp4';
      
      console.log('🎥 Attempting to load idle video:', idleVideoSrc);
      
      // Set up error handling for the idle video
      idleVideoElement.onerror = (error) => {
        console.warn('🎥 Idle video failed to load:', idleVideoSrc, error);
        console.log('💡 To add idle video: Place', idleVideoSrc, 'in the public/ folder');
        // Hide the idle video element if it fails to load
        idleVideoElement.style.display = 'none';
      };
      
      idleVideoElement.onloadeddata = () => {
        console.log('🎥 Idle video loaded successfully:', idleVideoSrc);
        idleVideoElement.style.display = 'block';
      };
      
      // Set the source and attempt to play
      idleVideoElement.src = idleVideoSrc;
      
      idleVideoElement.play().then(() => {
        console.log('🎥 Idle video playing:', idleVideoSrc);
      }).catch(error => {
        console.log('🎥 Idle video autoplay failed (this is normal):', error.message);
        // Autoplay failure is expected and normal for most browsers
      });
    } else {
      console.warn('🎥 Idle video element not found');
    }
  };

  // Stop all streams
  const stopAllStreams = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('stopping video streams');
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Close peer connection
  const closePC = () => {
    if (!peerConnectionRef.current) return;
    
    console.log('stopping peer connection');
    peerConnectionRef.current.close();
    peerConnectionRef.current.removeEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
    peerConnectionRef.current.removeEventListener('icecandidate', onIceCandidate, true);
    peerConnectionRef.current.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
    peerConnectionRef.current.removeEventListener('connectionstatechange', onConnectionStateChange, true);
    peerConnectionRef.current.removeEventListener('signalingstatechange', onSignalingStateChange, true);
    peerConnectionRef.current.removeEventListener('track', onTrack, true);
    
    if (pcDataChannelRef.current) {
      pcDataChannelRef.current.removeEventListener('message', onStreamEvent, true);
    }

    if (statsIntervalIdRef.current) {
      clearInterval(statsIntervalIdRef.current);
    }
    
    // Reset states like reference implementation
    setIsStreamReady(!stream_warmup);
    peerConnectionRef.current = null;
    pcDataChannelRef.current = null;
    console.log('stopped peer connection');
  };

  // WebSocket-based message sending to avatar
  const sendMessageToAvatar = async (text) => {
    console.log('Attempting to send message to avatar:', text);
    console.log('Stream ready:', isStreamReady, 'Stream ID:', streamId, 'Session ID:', sessionId);
    
    if (!isStreamReady || !streamId || !sessionId || !wsRef.current) {
      console.error('Stream not ready - isStreamReady:', isStreamReady, 'streamId:', streamId, 'sessionId:', sessionId, 'websocket:', !!wsRef.current);
      return;
    }

    try {
      console.log('Sending message via WebSocket...');
      
      // Split text into words for chunked streaming
      let chunks = text.split(' ');
      chunks.push(''); // Indicates end of text stream

      for (const [index, chunk] of chunks.entries()) {
        const streamMessage = {
          type: 'stream-text',
          payload: {
            script: {
              type: 'text',
              input: chunk + ' ',
              provider: {
                type: 'microsoft',
                voice_id: 'es-MX-DaliaNeural',
              },
              ssml: true,
            },
            config: {
              stitch: true,
            },
            audio_optimization: 5,
            background: {
              color: '#FFFFFF',
            },
            index, // Add index to track the order of the chunks
            session_id: sessionId,
            stream_id: streamId,
            presenter_type: 'clip',
          },
        };

        sendMessage(wsRef.current, streamMessage);
      }
      
      console.log('Message sent to avatar successfully via WebSocket');
    } catch (error) {
      console.error('Error sending message to avatar:', error);
    }
  };

  // WebSocket-based stream closure
  const closeStream = async () => {
    if (streamId && sessionId && wsRef.current) {
      try {
        const streamMessage = {
          type: 'delete-stream',
          payload: {
            session_id: sessionId,
            stream_id: streamId,
          },
        };
        sendMessage(wsRef.current, streamMessage);
        console.log('Stream deletion message sent');
      } catch (error) {
        console.error('Error sending stream deletion message:', error);
      }
    }

    // Close WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clean up
    stopAllStreams();
    closePC();
    
    setStreamId(null);
    setSessionId(null);
    setIsStreamReady(false);
    setConnectionStatus('disconnected');
  };

  // Modified handlers
  const handleSendMessage = () => {
    if (message.trim()) {
      setDisplayedMessage(message);
      
      // If connected to D-ID Clips, send message to Clips avatar
      if (isStreamReady) {
        sendMessageToAvatar(message);
      }
      
      // If connected to D-ID Talks, send message to Talks avatar
      if (isTalksStreamReady) {
        sendMessageToTalksAvatar(message);
      }
      
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleConnect = () => {
    if (connectionStatus === 'disconnected') {
      setConnectionStatus('connecting');
      createStream();
    } else if (connectionStatus === 'connected') {
      closeStream();
    }
  };

  const getButtonText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Disconnect';
      default:
        return 'Connect to D-ID Clips';
    }
  };

  const getButtonClass = () => {
    return `connect-button ${connectionStatus}`;
  };

  // D-ID Talks handlers
  const handleTalksConnect = () => {
    if (talksConnectionStatus === 'disconnected') {
      setTalksConnectionStatus('connecting');
      createTalksStream();
    } else if (talksConnectionStatus === 'connected') {
      closeTalksStream();
    }
  };

  // D-ID Talks functionality
  // Step 1: Create a new stream for Talks
  const createTalksStream = async () => {
    try {
      console.log('Creating new Talks stream...');
      console.log('Using API key:', DID_CONFIG.API_KEY.substring(0, 10) + '...');
      
      const response = await fetchWithRetries(`${DID_CONFIG.API_BASE_URL}/talks/streams`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${DID_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: DID_CONFIG.SOURCE_URL, // Using configured image URL
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Talks stream creation failed:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Talks stream created successfully:', data);
      
      setTalksStreamId(data.id);
      setTalksSessionId(data.session_id);
      
      // Step 2: Start the stream with WebRTC
      await startTalksStream(data.offer, data.ice_servers, data.id, data.session_id);
      
    } catch (error) {
      console.error('Error creating Talks stream:', error);
      setTalksConnectionStatus('disconnected');
      
      // Show user-friendly error message
      alert(`Talks connection failed: ${error.message}\n\nPlease check:\n1. Your API key is correct\n2. You have sufficient credits\n3. D-ID Talks is available for your account`);
    }
  };

  const getTalksButtonText = () => {
    switch (talksConnectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Disconnect';
      default:
        return 'Connect to D-ID Talks';
    }
  };

  const getTalksButtonClass = () => {
    return `connect-button ${talksConnectionStatus}`;
  };

  // Step 2: Starting the stream for Talks
  const createTalksPeerConnection = async (offer, iceServers, streamId, sessionId) => {
    if (!talksPeerConnectionRef.current) {
      talksPeerConnectionRef.current = new RTCPeerConnection({ iceServers });
      
      // Event listeners
      talksPeerConnectionRef.current.addEventListener('icegatheringstatechange', onTalksIceGatheringStateChange, true);
      talksPeerConnectionRef.current.addEventListener('icecandidate', (event) => onTalksIceCandidate(event, streamId, sessionId), true);
      talksPeerConnectionRef.current.addEventListener('iceconnectionstatechange', onTalksIceConnectionStateChange, true);
      talksPeerConnectionRef.current.addEventListener('connectionstatechange', onTalksConnectionStateChange, true);
      talksPeerConnectionRef.current.addEventListener('signalingstatechange', onTalksSignalingStateChange, true);
      talksPeerConnectionRef.current.addEventListener('track', onTalksTrack, true);
    }

    await talksPeerConnectionRef.current.setRemoteDescription(offer);
    const sessionClientAnswer = await talksPeerConnectionRef.current.createAnswer();
    await talksPeerConnectionRef.current.setLocalDescription(sessionClientAnswer);

    return sessionClientAnswer;
  };

  const startTalksStream = async (offer, iceServers, streamId, sessionId) => {
    try {
      console.log('Starting Talks stream...');
      const sessionClientAnswer = await createTalksPeerConnection(offer, iceServers, streamId, sessionId);
      
      // Send SDP answer
      const sdpResponse = await fetch(`${DID_CONFIG.API_BASE_URL}/talks/streams/${streamId}/sdp`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${DID_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: sessionClientAnswer,
          session_id: sessionId,
        }),
      });

      if (sdpResponse.ok) {
        console.log('Talks SDP answer sent successfully');
      }

    } catch (error) {
      console.error('Error starting Talks stream:', error);
      setTalksConnectionStatus('disconnected');
    }
  };

  // Step 3: Submit network information (ICE candidates) for Talks
  const onTalksIceCandidate = useCallback((event, streamId, sessionId) => {
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

      fetch(`${DID_CONFIG.API_BASE_URL}/talks/streams/${streamId}/ice`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${DID_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate,
          sdpMid,
          sdpMLineIndex,
          session_id: sessionId,
        }),
      }).catch(error => console.error('Error sending Talks ICE candidate:', error));
    }
  }, []);

  // Talks event handlers
  const onTalksIceGatheringStateChange = () => {
    console.log('Talks ICE gathering state:', talksPeerConnectionRef.current?.iceGatheringState);
  };

  const onTalksIceConnectionStateChange = () => {
    const state = talksPeerConnectionRef.current?.iceConnectionState;
    console.log('🔗 Talks ICE connection state:', state);
    
    if (state === 'connected' || state === 'completed') {
      console.log('🔗 Setting Talks stream as ready and connection as connected');
      setIsTalksStreamReady(true);
      setTalksConnectionStatus('connected');
      console.log('🔗 Talks WebRTC connection established successfully');
      
      // Debug peer connection state
      console.log('🔗 Talks peer connection details:', {
        connectionState: talksPeerConnectionRef.current?.connectionState,
        iceConnectionState: talksPeerConnectionRef.current?.iceConnectionState,
        signalingState: talksPeerConnectionRef.current?.signalingState,
        localDescription: !!talksPeerConnectionRef.current?.localDescription,
        remoteDescription: !!talksPeerConnectionRef.current?.remoteDescription
      });

      // Check for remote streams
      if (talksPeerConnectionRef.current) {
        const receivers = talksPeerConnectionRef.current.getReceivers();
        console.log('🔗 Talks receivers:', receivers.length);
        receivers.forEach((receiver, index) => {
          console.log(`🔗 Talks receiver ${index}:`, {
            track: receiver.track,
            trackKind: receiver.track?.kind,
            trackEnabled: receiver.track?.enabled,
            trackReadyState: receiver.track?.readyState
          });
        });

        const remoteTracks = receivers.map(r => r.track).filter(t => t);
        if (remoteTracks.length > 0) {
          console.log('🎥 Creating manual stream from remote tracks');
          const manualStream = new MediaStream(remoteTracks);
          if (talksVideoRef.current) {
            talksVideoRef.current.srcObject = manualStream;
            console.log('🎥 Manual stream assigned to video element');
            
            setTimeout(() => {
              if (talksVideoRef.current) {
                talksVideoRef.current.play().then(() => {
                  console.log('🎥 Manual stream playing successfully');
                }).catch(error => {
                  console.error('🎥 Manual stream play failed:', error);
                });
              }
            }, 1000);
          }
        } else {
          // Retry after a delay in case tracks aren't ready yet
          console.log('🔄 No tracks found initially, retrying in 2 seconds...');
          setTimeout(() => {
            if (talksPeerConnectionRef.current && talksVideoRef.current) {
              const retryReceivers = talksPeerConnectionRef.current.getReceivers();
              const retryTracks = retryReceivers.map(r => r.track).filter(t => t && t.readyState === 'live');
              console.log('🔄 Retry found tracks:', retryTracks.length);
              
              if (retryTracks.length > 0) {
                const retryStream = new MediaStream(retryTracks);
                talksVideoRef.current.srcObject = retryStream;
                console.log('🔄 Retry stream assigned successfully');
                
                setTimeout(() => {
                  if (talksVideoRef.current) {
                    talksVideoRef.current.play().then(() => {
                      console.log('🔄 Retry stream playing successfully');
                    }).catch(error => {
                      console.error('🔄 Retry stream play failed:', error);
                    });
                  }
                }, 500);
              }
            }
          }, 2000);
        }
      }
      
    } else if (state === 'failed' || state === 'disconnected') {
      console.log('🔗 Talks connection failed or disconnected');
      setTalksConnectionStatus('disconnected');
      setIsTalksStreamReady(false);
    }
  };

  const onTalksConnectionStateChange = () => {
    console.log('Talks connection state:', talksPeerConnectionRef.current?.connectionState);
  };

  const onTalksSignalingStateChange = () => {
    console.log('Talks signaling state:', talksPeerConnectionRef.current?.signalingState);
  };

  const onTalksTrack = (event) => {
    console.log('🎥 Received Talks track event:', event);
    console.log('🎥 Talks event streams:', event.streams);
    console.log('🎥 Talks event track:', event.track);
    console.log('🎥 Talks track kind:', event.track?.kind);
    console.log('🎥 Talks track readyState:', event.track?.readyState);
    
    if (talksVideoRef.current && event.streams && event.streams[0]) {
      console.log('🎥 Setting Talks video srcObject to stream');
      const stream = event.streams[0];
      talksVideoRef.current.srcObject = stream;
      
      // Check for audio tracks
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      console.log('🔊 Talks audio tracks found:', audioTracks.length);
      console.log('🎥 Talks video tracks found:', videoTracks.length);
      audioTracks.forEach((track, index) => {
        console.log(`🔊 Talks audio track ${index}:`, track.label, track.enabled);
      });
      videoTracks.forEach((track, index) => {
        console.log(`🎥 Talks video track ${index}:`, track.label, track.enabled);
      });
      
      // Force immediate play
      console.log('🎥 Forcing immediate play of Talks video');
      talksVideoRef.current.play().then(() => {
        console.log('🎥 Talks video playing immediately after track received');
        talksVideoRef.current.muted = false;
        console.log('🔊 Talks video unmuted immediately');
      }).catch(error => {
        console.log('🎥 Talks video immediate play failed, trying muted:', error);
        talksVideoRef.current.muted = true;
        return talksVideoRef.current.play();
      }).then(() => {
        console.log('🎥 Talks video playing (muted mode)');
        setTimeout(() => {
          if (talksVideoRef.current) {
            talksVideoRef.current.muted = false;
            console.log('🔊 Talks video unmuted after delay');
          }
        }, 2000);
      }).catch(error => {
        console.error('🎥 Failed to play Talks video completely:', error);
      });
      
    } else {
      console.error('🎥 Talks video ref or stream not available:', {
        videoRef: !!talksVideoRef.current,
        streams: event.streams?.length,
        firstStream: !!event.streams?.[0]
      });
    }
  };

  // Step 4: Create a talk stream (send message to avatar)
  const sendMessageToTalksAvatar = async (text) => {
    console.log('Attempting to send message to Talks avatar:', text);
    console.log('Talks stream ready:', isTalksStreamReady, 'Talks Stream ID:', talksStreamId, 'Talks Session ID:', talksSessionId);
    
    if (!isTalksStreamReady || !talksStreamId || !talksSessionId) {
      console.error('Talks stream not ready - isTalksStreamReady:', isTalksStreamReady, 'talksStreamId:', talksStreamId, 'talksSessionId:', talksSessionId);
      return;
    }

    try {
      console.log('Sending message to D-ID Talks API...');
      const response = await fetch(`${DID_CONFIG.API_BASE_URL}/talks/streams/${talksStreamId}`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${DID_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            provider: { type: 'microsoft', voice_id: 'es-CO-SalomeNeural' },
            input: text,
            ssml: true,
          },
          config: {
            fluent: true,
          },
          audio_optimization: 2,
          session_id: talksSessionId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Message sent to Talks avatar successfully:', responseData);
        
        // Force video to play when message is sent
        setTimeout(() => {
          if (talksVideoRef.current && talksVideoRef.current.paused) {
            console.log('🎥 Forcing Talks video to play after message sent');
            talksVideoRef.current.play().catch(console.error);
          }
        }, 500);
        
      } else {
        console.error('Failed to send Talks message, response status:', response.status);
        const errorText = await response.text();
        console.error('Talks error response:', errorText);
      }
    } catch (error) {
      console.error('Error sending message to Talks avatar:', error);
    }
  };

  // Step 5: Closing the Talks stream
  const closeTalksStream = async () => {
    if (talksStreamId && talksSessionId) {
      try {
        await fetch(`${DID_CONFIG.API_BASE_URL}/talks/streams/${talksStreamId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${DID_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: talksSessionId }),
        });
        console.log('Talks stream closed successfully');
      } catch (error) {
        console.error('Error closing Talks stream:', error);
      }
    }

    // Clean up
    if (talksPeerConnectionRef.current) {
      talksPeerConnectionRef.current.close();
      talksPeerConnectionRef.current = null;
    }
    
    setTalksStreamId(null);
    setTalksSessionId(null);
    setIsTalksStreamReady(false);
    setTalksConnectionStatus('disconnected');
  };

  return (
    <div className="App">
      {/* Connect button in top left */}
      <button 
        onClick={handleConnect} 
        className={getButtonClass()}
        disabled={connectionStatus === 'connecting'}
      >
        {getButtonText()}
        {connectionStatus === 'connecting' && (
          <span className="loading-spinner"></span>
        )}
      </button>

      {/* D-ID Talks Connect button */}
      <button 
        onClick={handleTalksConnect} 
        className={getTalksButtonClass()}
        disabled={talksConnectionStatus === 'connecting'}
        style={{ 
          position: 'absolute',
          top: '80px',
          left: '20px',
          zIndex: 1000
        }}
      >
        {getTalksButtonText()}
        {talksConnectionStatus === 'connecting' && (
          <span className="loading-spinner"></span>
        )}
      </button>

      {/* D-ID Agent Video Container */}
      <div className="agent-container">
        {/* Clips streaming videos (WebSocket-based) */}
        <div className="clips-video-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Stream video element for clips */}
          <video 
            ref={videoRef}
            id="stream-video-element"
            autoPlay 
            playsInline 
            muted={!isStreamReady}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              backgroundColor: 'white',
              opacity: 1, // Always visible - no blinking
              zIndex: 2
            }}
            onLoadedMetadata={() => console.log('🎥 Stream video metadata loaded')}
            onCanPlay={() => console.log('🎥 Stream video can play')}
            onPlaying={() => console.log('🎥 Stream video is playing')}
            onPlay={() => console.log('🎥 Stream video play event')}
            onPause={() => console.log('🎥 Stream video pause event')}
            onError={(e) => console.error('🎥 Stream video error:', e)}
          />

          {/* Talks video (REST-based, fallback) */}
          <video 
            ref={talksVideoRef}
            autoPlay 
            playsInline 
            muted={false}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              backgroundColor: 'white',
              opacity: isTalksStreamReady ? 1 : 0,
              zIndex: isTalksStreamReady ? 3 : 0,
              display: isTalksStreamReady ? 'block' : 'none'
            }}
            onLoadedMetadata={() => console.log('🎥 Talks video metadata loaded')}
            onCanPlay={() => console.log('🎥 Talks video can play')}
            onPlaying={() => console.log('🎥 Talks video is playing')}
            onPlay={() => console.log('🎥 Talks video play event')}
            onPause={() => console.log('🎥 Talks video pause event')}
            onError={(e) => console.error('🎥 Talks video error:', e)}
          />
        </div>

        {/* Overlay for when no streams are ready */}
        {!isStreamReady && !isTalksStreamReady && (
          <div className="overlay">
            {displayedMessage ? (
              <p className="displayed-message">{displayedMessage}</p>
            ) : (
              <p>D-ID Agent Area</p>
            )}
          </div>
        )}

        {/* Debug info */}
        {(isStreamReady || isTalksStreamReady) && (
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10
          }}>
            {isStreamReady && isTalksStreamReady 
              ? 'Both Streams Ready - Showing: Talks' 
              : isStreamReady 
                ? `Clips Stream Ready (WS) - Always Visible`
                : `Talks Stream Ready (REST) - Video Status: ${talksVideoRef.current?.paused ? 'Paused' : 'Playing'}`
            }
          </div>
        )}

        {/* Manual play button for debugging */}
        {isTalksStreamReady && (
          <button 
            onClick={() => {
              console.log('🎥 Manual play button clicked for Talks');
              console.log('🎥 talksVideoRef current:', !!talksVideoRef.current);
              console.log('🎥 talksVideoRef srcObject:', !!talksVideoRef.current?.srcObject);
              console.log('🎥 talksVideoRef paused:', talksVideoRef.current?.paused);
              if (talksVideoRef.current) {
                talksVideoRef.current.play().then(() => {
                  console.log('🎥 Manual play successful');
                }).catch(error => {
                  console.error('🎥 Manual play failed:', error);
                });
              }
            }}
            style={{
              position: 'absolute',
              top: '30px',
              left: '5px',
              zIndex: 10,
              background: 'rgba(0,255,0,0.7)',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'white'
            }}
          >
            ▶ Play Talks
          </button>
        )}

        {/* Debug info button */}
        {isTalksStreamReady && (
          <button 
            onClick={() => {
              console.log('🔍 TALKS DEBUG INFO:');
              console.log('🔍 Talks Video Ref:', {
                exists: !!talksVideoRef.current,
                srcObject: !!talksVideoRef.current?.srcObject,
                paused: talksVideoRef.current?.paused,
                muted: talksVideoRef.current?.muted,
                readyState: talksVideoRef.current?.readyState,
                videoWidth: talksVideoRef.current?.videoWidth,
                videoHeight: talksVideoRef.current?.videoHeight,
                currentTime: talksVideoRef.current?.currentTime,
                duration: talksVideoRef.current?.duration
              });
              
              if (talksVideoRef.current?.srcObject) {
                const stream = talksVideoRef.current.srcObject;
                console.log('🔍 Stream Info:', {
                  id: stream.id,
                  active: stream.active,
                  audioTracks: stream.getAudioTracks().length,
                  videoTracks: stream.getVideoTracks().length
                });
                
                stream.getTracks().forEach((track, index) => {
                  console.log(`🔍 Track ${index}:`, {
                    kind: track.kind,
                    enabled: track.enabled,
                    readyState: track.readyState,
                    muted: track.muted,
                    label: track.label
                  });
                });
              }

              if (talksPeerConnectionRef.current) {
                console.log('🔍 Peer Connection:', {
                  connectionState: talksPeerConnectionRef.current.connectionState,
                  iceConnectionState: talksPeerConnectionRef.current.iceConnectionState,
                  signalingState: talksPeerConnectionRef.current.signalingState,
                  receivers: talksPeerConnectionRef.current.getReceivers().length,
                  senders: talksPeerConnectionRef.current.getSenders().length
                });

                // Debug receivers
                const receivers = talksPeerConnectionRef.current.getReceivers();
                receivers.forEach((receiver, index) => {
                  console.log(`🔍 Receiver ${index}:`, {
                    track: !!receiver.track,
                    trackKind: receiver.track?.kind,
                    trackEnabled: receiver.track?.enabled,
                    trackReadyState: receiver.track?.readyState,
                    trackMuted: receiver.track?.muted
                  });
                });
              }
            }}
            style={{
              position: 'absolute',
              top: '60px',
              left: '5px',
              zIndex: 10,
              background: 'rgba(255,165,0,0.7)',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'white'
            }}
          >
            🔍 Debug
          </button>
        )}

        {/* Force stream button */}
        {isTalksStreamReady && (
          <button 
            onClick={() => {
              console.log('🔧 Forcing stream creation from receivers...');
              if (talksPeerConnectionRef.current && talksVideoRef.current) {
                const receivers = talksPeerConnectionRef.current.getReceivers();
                const tracks = receivers.map(r => r.track).filter(t => t && t.readyState === 'live');
                
                console.log('🔧 Found tracks:', tracks.length);
                tracks.forEach((track, index) => {
                  console.log(`🔧 Track ${index}:`, track.kind, track.readyState);
                });

                if (tracks.length > 0) {
                  const forceStream = new MediaStream(tracks);
                  talksVideoRef.current.srcObject = forceStream;
                  console.log('🔧 Force stream created and assigned');
                  
                  setTimeout(() => {
                    talksVideoRef.current.play().then(() => {
                      console.log('🔧 Force stream playing successfully!');
                    }).catch(error => {
                      console.error('🔧 Force stream play failed:', error);
                    });
                  }, 500);
                } else {
                  console.log('🔧 No live tracks found');
                }
              }
            }}
            style={{
              position: 'absolute',
              top: '90px',
              left: '5px',
              zIndex: 10,
              background: 'rgba(255,0,0,0.7)',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'white'
            }}
          >
            🔧 Force Stream
          </button>
        )}
      </div>

      {/* Input and Send Button */}
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isStreamReady || isTalksStreamReady 
              ? "Send message to avatar(s)..." 
              : "Type your message here..."
          }
          className="text-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;