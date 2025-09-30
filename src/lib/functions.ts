/**
 * FILE: src/lib/functions.ts
 * 
 * All custom function declarations and handlers in one place
 */

import { FunctionDeclaration, Type } from "@google/genai";

// ============================================
// FUNCTION DECLARATIONS
// ============================================

export const weatherDeclaration: FunctionDeclaration = {
  name: "get_weather",
  description: "Get current weather information for a location. Use when user asks about weather, temperature, or climate.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "City name or location (e.g., 'Nairobi', 'London')",
      },
      units: {
        type: Type.STRING,
        description: "Temperature units",
        enum: ["celsius", "fahrenheit"],
      },
    },
    required: ["location"],
  },
};

export const calculateDeclaration: FunctionDeclaration = {
  name: "calculate",
  description: "Perform mathematical calculations. Use when user asks to calculate, compute, or solve math problems.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      expression: {
        type: Type.STRING,
        description: "Mathematical expression to evaluate (e.g., '2 + 2', '10 * 5 - 3')",
      },
    },
    required: ["expression"],
  },
};

export const notificationDeclaration: FunctionDeclaration = {
  name: "send_notification",
  description: "Send a browser notification to the user. Use when user asks to remind them or notify them of something.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "Notification title",
      },
      message: {
        type: Type.STRING,
        description: "Notification message body",
      },
    },
    required: ["title", "message"],
  },
};

export const saveNoteDeclaration: FunctionDeclaration = {
  name: "save_note",
  description: "Save a note or memo for later. Use when user wants to remember something or take notes.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "Note title or subject",
      },
      content: {
        type: Type.STRING,
        description: "Note content or body text",
      },
    },
    required: ["title", "content"],
  },
};

export const timerDeclaration: FunctionDeclaration = {
  name: "set_timer",
  description: "Set a countdown timer. Use when user asks to be reminded after a certain time.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      minutes: {
        type: Type.NUMBER,
        description: "Number of minutes for the timer",
      },
      message: {
        type: Type.STRING,
        description: "Message to show when timer completes",
      },
    },
    required: ["minutes", "message"],
  },
};

export const decisionDeclaration: FunctionDeclaration = {
  name: "make_decision",
  description: "Help make a random decision when user can't choose. Use when user asks to pick, choose, or decide between options.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      options: {
        type: Type.STRING,
        description: "Comma-separated options to choose from (e.g., 'pizza,burger,pasta')",
      },
    },
    required: ["options"],
  },
};

export const openUrlDeclaration: FunctionDeclaration = {
  name: "open_url",
  description: "Open a URL in a new browser tab. Use when user wants to visit a website or open a link.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      url: {
        type: Type.STRING,
        description: "URL to open (must start with http:// or https://)",
      },
    },
    required: ["url"],
  },
};

// ============================================
// FUNCTION HANDLERS
// ============================================

export const handleGetWeather = async (args: any) => {
  const { location, units = "celsius" } = args;
  
  // Simulate API call (replace with real weather API)
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const temp = units === "celsius" ? 22 : 72;
  return {
    success: true,
    location,
    temperature: temp,
    units,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 15,
  };
};

export const handleCalculate = (args: any) => {
  const { expression } = args;
  
  try {
    // WARNING: eval is dangerous! Use math.js library in production
    const result = Function(`"use strict"; return (${expression})`)();
    return {
      success: true,
      expression,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      expression,
    };
  }
};

export const handleSendNotification = (args: any) => {
  const { title, message } = args;
  
  // Request permission and send notification
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  }
  
  return {
    success: true,
    title,
    message,
    sent: true,
  };
};

export const handleSaveNote = (args: any) => {
  const { title, content } = args;
  const timestamp = new Date().toISOString();
  
  // Get existing notes from session storage
  const notesKey = 'friday_notes';
  const existingNotes = JSON.parse(sessionStorage.getItem(notesKey) || '[]');
  
  const newNote = {
    id: Date.now(),
    title,
    content,
    timestamp,
  };
  
  existingNotes.push(newNote);
  sessionStorage.setItem(notesKey, JSON.stringify(existingNotes));
  
  return {
    success: true,
    message: `Note "${title}" saved successfully`,
    noteId: newNote.id,
  };
};

export const handleSetTimer = (args: any) => {
  const { minutes, message } = args;
  const milliseconds = minutes * 60 * 1000;
  
  setTimeout(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⏰ Timer Complete!", { body: message });
    }
    alert(`⏰ Timer: ${message}`);
  }, milliseconds);
  
  return {
    success: true,
    message: `Timer set for ${minutes} minutes`,
    completionTime: new Date(Date.now() + milliseconds).toLocaleTimeString(),
  };
};

export const handleMakeDecision = (args: any) => {
  const { options } = args;
  const optionsArray = options.split(',').map((o: string) => o.trim());
  const chosen = optionsArray[Math.floor(Math.random() * optionsArray.length)];
  
  return {
    success: true,
    options: optionsArray,
    decision: chosen,
    message: `I choose: ${chosen}`,
  };
};

export const handleOpenUrl = (args: any) => {
  const { url } = args;
  
  // Validate URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return {
      success: false,
      error: "URL must start with http:// or https://",
    };
  }
  
  window.open(url, '_blank');
  
  return {
    success: true,
    url,
    message: `Opened ${url}`,
  };
};

// ============================================
// FUNCTION ROUTER
// ============================================

/**
 * Main handler that routes function calls to appropriate handlers
 */
export const handleFunctionCall = async (functionName: any, args: any) => {
  switch (functionName) {
    case "get_weather":
      return await handleGetWeather(args);
    
    case "calculate":
      return handleCalculate(args);
    
    case "send_notification":
      return handleSendNotification(args);
    
    case "save_note":
      return handleSaveNote(args);
    
    case "set_timer":
      return handleSetTimer(args);
    
    case "make_decision":
      return handleMakeDecision(args);
    
    case "open_url":
      return handleOpenUrl(args);
    
    default:
      return null; // Not handled by this library
  }
};

// ============================================
// EXPORT ALL DECLARATIONS AS ARRAY
// ============================================

export const allFunctionDeclarations = [
  weatherDeclaration,
  calculateDeclaration,
  notificationDeclaration,
  saveNoteDeclaration,
  timerDeclaration,
  decisionDeclaration,
  openUrlDeclaration,
];