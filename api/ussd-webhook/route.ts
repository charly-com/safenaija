import { type NextRequest, NextResponse } from "next/server"

interface USSDRequest {
  sessionId: string
  phoneNumber: string
  text: string
  serviceCode: string
}

interface USSDResponse {
  response: string
  action: "CON" | "END"
}

// USSD session storage (in production, use Redis or database)
const sessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const ussdData: USSDRequest = await request.json()
    const { sessionId, phoneNumber, text, serviceCode } = ussdData

    // Get or create session
    const session = sessions.get(sessionId) || {
      phoneNumber,
      step: 0,
      data: {},
      startTime: Date.now(),
    }

    const response = await handleUSSDFlow(session, text, serviceCode)

    // Update session
    sessions.set(sessionId, session)

    // Clean up completed sessions after 5 minutes
    if (response.action === "END") {
      setTimeout(() => sessions.delete(sessionId), 300000)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("USSD webhook error:", error)
    return NextResponse.json({
      response: "Service temporarily unavailable. Please try again later.",
      action: "END",
    })
  }
}

async function handleUSSDFlow(session: any, text: string, serviceCode: string): Promise<USSDResponse> {
  const inputs = text.split("*")
  const currentInput = inputs[inputs.length - 1] || ""

  // Main menu based on service code
  if (serviceCode === "*234*911#") {
    return handleEmergencyFlow(session, currentInput, inputs.length - 1)
  } else if (serviceCode === "*234*100#") {
    return handleCrimeReportFlow(session, currentInput, inputs.length - 1)
  } else if (serviceCode === "*234*199#") {
    return handleSafetyCheckFlow(session, currentInput, inputs.length - 1)
  }

  // Default SafeNaija menu
  return handleMainMenu(session, currentInput, inputs.length - 1)
}

async function handleEmergencyFlow(session: any, input: string, step: number): Promise<USSDResponse> {
  switch (step) {
    case 0:
      return {
        response: `CON EMERGENCY ALERT - SafeNaija
1. Medical Emergency
2. Security Threat
3. Fire Emergency
4. Accident
5. Other Emergency`,
        action: "CON",
      }

    case 1:
      const emergencyTypes = ["Medical", "Security", "Fire", "Accident", "Other"]
      session.data.emergencyType = emergencyTypes[Number.parseInt(input) - 1] || "Other"

      return {
        response: `CON Emergency: ${session.data.emergencyType}
Please provide your location:
1. Use my current location
2. Enter location manually`,
        action: "CON",
      }

    case 2:
      if (input === "1") {
        session.data.location = "GPS_CURRENT"
        return {
          response: `CON Location: Current GPS
Brief description of emergency:`,
          action: "CON",
        }
      } else {
        return {
          response: `CON Enter your location (e.g., "Mile 2 Bridge, Lagos"):`,
          action: "CON",
        }
      }

    case 3:
      if (session.data.location === "GPS_CURRENT") {
        session.data.description = input
      } else {
        session.data.location = input
        return {
          response: `CON Location: ${input}
Brief description of emergency:`,
          action: "CON",
        }
      }

      // Process emergency alert
      await processEmergencyUSSD(session)

      return {
        response: `END EMERGENCY ALERT SENT!
Reference: EMG${Date.now().toString().slice(-6)}
Help is on the way.
Stay safe and keep your phone on.

For immediate assistance:
Call 199 or 112`,
        action: "END",
      }

    case 4:
      session.data.description = input
      await processEmergencyUSSD(session)

      return {
        response: `END EMERGENCY ALERT SENT!
Reference: EMG${Date.now().toString().slice(-6)}
Help is on the way.
Stay safe and keep your phone on.

For immediate assistance:
Call 199 or 112`,
        action: "END",
      }

    default:
      return {
        response: "END Invalid selection. Please try again.",
        action: "END",
      }
  }
}

async function handleCrimeReportFlow(session: any, input: string, step: number): Promise<USSDResponse> {
  switch (step) {
    case 0:
      return {
        response: `CON CRIME REPORT - SafeNaija
1. Robbery/Theft
2. Kidnapping
3. Assault
4. Cybercrime/Fraud
5. Drug-related
6. Other Crime`,
        action: "CON",
      }

    case 1:
      const crimeTypes = ["Robbery/Theft", "Kidnapping", "Assault", "Cybercrime/Fraud", "Drug-related", "Other Crime"]
      session.data.crimeType = crimeTypes[Number.parseInt(input) - 1] || "Other Crime"

      return {
        response: `CON Crime: ${session.data.crimeType}
When did this occur?
1. Happening now
2. Within last hour
3. Today
4. Yesterday
5. Earlier`,
        action: "CON",
      }

    case 2:
      const timeframes = ["Happening now", "Within last hour", "Today", "Yesterday", "Earlier"]
      session.data.timeframe = timeframes[Number.parseInt(input) - 1] || "Earlier"

      return {
        response: `CON Time: ${session.data.timeframe}
Location of incident:`,
        action: "CON",
      }

    case 3:
      session.data.location = input

      return {
        response: `CON Location: ${input}
Brief description (optional):
(Send * to skip)`,
        action: "CON",
      }

    case 4:
      if (input !== "*") {
        session.data.description = input
      }

      await processCrimeReportUSSD(session)

      return {
        response: `END CRIME REPORT SUBMITTED
Reference: CR${Date.now().toString().slice(-6)}

Your report has been received and will be investigated.

Thank you for helping keep Nigeria safe.
- SafeNaija Team`,
        action: "END",
      }

    default:
      return {
        response: "END Invalid selection. Please try again.",
        action: "END",
      }
  }
}

async function handleSafetyCheckFlow(session: any, input: string, step: number): Promise<USSDResponse> {
  switch (step) {
    case 0:
      return {
        response: `CON SAFETY CHECK - SafeNaija
1. Check area safety status
2. Get safety tips
3. Report suspicious activity
4. Emergency contacts
5. Back to main menu`,
        action: "CON",
      }

    case 1:
      switch (input) {
        case "1":
          return {
            response: `CON Enter your location to check safety status:`,
            action: "CON",
          }
        case "2":
          return {
            response: `END SAFETY TIPS:
• Always inform someone of your travel plans
• Avoid displaying expensive items
• Stay in well-lit areas at night
• Trust your instincts
• Keep emergency numbers handy

Stay safe! - SafeNaija`,
            action: "END",
          }
        case "3":
          return handleCrimeReportFlow(session, "", 0)
        case "4":
          return {
            response: `END EMERGENCY CONTACTS:
Police: 199
Fire Service: 199
Ambulance: 199
Emergency: 112

SafeNaija Hotline: *234*911#

Save these numbers!`,
            action: "END",
          }
        default:
          return handleMainMenu(session, "", 0)
      }

    case 2:
      if (session.data.checkingLocation) {
        const location = input
        const safetyStatus = await checkAreaSafety(location)

        return {
          response: `END SAFETY STATUS: ${location}
Threat Level: ${safetyStatus.level}
${safetyStatus.message}

Last Updated: ${new Date().toLocaleTimeString()}
Stay vigilant and report any suspicious activity.`,
          action: "END",
        }
      }
      break

    default:
      return {
        response: "END Invalid selection. Please try again.",
        action: "END",
      }
  }

  return {
    response: "END Service error. Please try again.",
    action: "END",
  }
}

async function handleMainMenu(session: any, input: string, step: number): Promise<USSDResponse> {
  if (step === 0) {
    return {
      response: `CON Welcome to SafeNaija
1. Emergency Alert (*234*911#)
2. Crime Report (*234*100#)
3. Safety Check (*234*199#)
4. About SafeNaija
5. Help`,
      action: "CON",
    }
  }

  switch (input) {
    case "1":
      return handleEmergencyFlow(session, "", 0)
    case "2":
      return handleCrimeReportFlow(session, "", 0)
    case "3":
      return handleSafetyCheckFlow(session, "", 0)
    case "4":
      return {
        response: `END SafeNaija AI Command & Citizen Network

Empowering Nigerian Police with AI-driven crime prediction and citizen reporting.

Working together for a safer Nigeria.

Visit: safenaija.gov.ng`,
        action: "END",
      }
    case "5":
      return {
        response: `END HELP - SafeNaija USSD Codes:

*234*911# - Emergency Alert
*234*100# - Crime Report  
*234*199# - Safety Check

For smartphone users:
Download SafeNaija app from Play Store

24/7 Support: 0800-SAFENAIJA`,
        action: "END",
      }
    default:
      return {
        response: "END Invalid selection. Please try again with a valid option.",
        action: "END",
      }
  }
}

async function processEmergencyUSSD(session: any) {
  // Process emergency alert from USSD
  console.log("Processing USSD emergency:", {
    phoneNumber: session.phoneNumber,
    type: session.data.emergencyType,
    location: session.data.location,
    description: session.data.description,
    timestamp: Date.now(),
  })

  // In production, this would:
  // 1. Alert nearby patrol units
  // 2. Send to command dashboard
  // 3. Initiate emergency response
  // 4. Send SMS confirmation
}

async function processCrimeReportUSSD(session: any) {
  // Process crime report from USSD
  console.log("Processing USSD crime report:", {
    phoneNumber: session.phoneNumber,
    crimeType: session.data.crimeType,
    timeframe: session.data.timeframe,
    location: session.data.location,
    description: session.data.description,
    timestamp: Date.now(),
  })

  // In production, this would:
  // 1. Add to crime database
  // 2. Update heatmap data
  // 3. Alert relevant units
  // 4. Send confirmation SMS
}

async function checkAreaSafety(location: string) {
  // Mock safety check - in production, this would query real crime data
  const riskLevels = ["LOW", "MEDIUM", "HIGH"]
  const randomLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]

  const messages = {
    LOW: "Area appears safe. Normal precautions advised.",
    MEDIUM: "Moderate risk detected. Stay alert and avoid isolated areas.",
    HIGH: "High risk area. Exercise extreme caution or avoid if possible.",
  }

  return {
    level: randomLevel,
    message: messages[randomLevel as keyof typeof messages],
  }
}
