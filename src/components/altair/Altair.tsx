
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import {
  FunctionDeclaration,
  LiveServerToolCall,
  Modality,
  Type,
} from "@google/genai";

// ============================================
// STEP 1: IMPORT YOUR FUNCTIONS
// ============================================

import { 
  allFunctionDeclarations,
  handleFunctionCall 
} from "../../lib/functions";

// ============================================
// ALTAIR GRAPH DECLARATION (Keep this)
// ============================================

const renderAltairDeclaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      json_graph: {
        type: Type.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const { client, setConfig, setModel } = useLiveAPIContext();

  // ============================================
  // STEP 2: REGISTER ALL FUNCTIONS IN CONFIG
  // ============================================
  useEffect(() => {
    setModel("models/gemini-2.0-flash-exp");
    setConfig({
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
      },
      systemInstruction: {
        parts: [
          {
            text: `
            - You are AFRI, You have access to various functions including:
            - render_altair: for creating graphs and charts
            - get_weather: for checking weather
            - calculate: for math operations
            - send_notification: for notifications
            - save_note: for saving notes
            - set_timer: for setting timers
            - make_decision: for random choices
            - open_url: for opening websites
            - You have vision capability, you can see tings people and objects 
            - you are super intelligent AGI, can do anything from math physics, chemistry, medicine, engineering etc...
            Try to very kind as much as possible and helpful
            - You have the capability of speaking many languages but always address people in English, no matter what languge they speak
            
            - Use these functions when appropriate. Don't ask for additional information, make your best judgement. 
            Always refer to me as sir or boss.`,
          },
        ],
      },
      tools: [
        { googleSearch: {} },
        { 
          functionDeclarations: [
            renderAltairDeclaration,
            ...allFunctionDeclarations, 
          ] 
        },
      ],
    });
  }, [setConfig, setModel]);

  // ============================================
  // STEP 3: HANDLE FUNCTION CALLS
  // ============================================
  useEffect(() => {
    const onToolCall = async (toolCall: LiveServerToolCall) => {
      if (!toolCall.functionCalls) {
        return;
      }

      const responses = await Promise.all(
        toolCall.functionCalls.map(async (fc) => {
          let result: any = { success: true };

          // Handle render_altair (your original function)
          if (fc.name === "render_altair") {
            const str = (fc.args as any).json_graph;
            setJSONString(str);
            result = { success: true, message: "Graph rendered" };
          }
          // Handle all other functions from the library
          else {
            result = await handleFunctionCall(fc.name, fc.args);
            
            // Store results for display
            if (result) {
              if (fc.name === "get_weather") {
                setWeatherData(result);
              } else if (fc.name === "calculate") {
                setCalculationResult(result);
              }
            }
            
            // If function not found in library, return null
            if (result === null) {
              result = { success: false, error: "Unknown function" };
            }
          }

          return {
            response: { output: result },
            id: fc.id,
            name: fc.name,
          };
        })
      );

      if (responses.length) {
        setTimeout(() => {
          client.sendToolResponse({
            functionResponses: responses,
          });
        }, 200);
      }
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  // ============================================
  // RENDER
  // ============================================
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      console.log("jsonString", jsonString);
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);

  return (
    <div className="altair-container">
      {/* Vega Graph */}
      <div className="vega-embed" ref={embedRef} />

      {/* Weather Display */}
      {weatherData && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          margin: '20px',
          maxWidth: '300px',
        }}>
          <h2>🌤️ {weatherData.location}</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
            {weatherData.temperature}°{weatherData.units === 'celsius' ? 'C' : 'F'}
          </div>
          <div style={{ fontSize: '18px', marginTop: '10px' }}>
            {weatherData.condition}
          </div>
          <div style={{ marginTop: '15px', fontSize: '14px' }}>
            💧 Humidity: {weatherData.humidity}%<br />
            💨 Wind: {weatherData.windSpeed} km/h
          </div>
        </div>
      )}

      {/* Calculation Result */}
      {calculationResult && calculationResult.success && (
        <div style={{
          background: '#f0f0f0',
          padding: '15px',
          borderRadius: '8px',
          margin: '20px',
          maxWidth: '300px',
        }}>
          <h3>🧮 Calculation</h3>
          <p><strong>{calculationResult.expression}</strong></p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
            = {calculationResult.result}
          </p>
        </div>
      )}
    </div>
  );
}

export const Altair = memo(AltairComponent);