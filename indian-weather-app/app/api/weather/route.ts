import { type NextRequest, NextResponse } from "next/server"

interface WeatherRequest {
  city: string
  state: string
}

interface WeatherData {
  city: string
  state: string
  temperature: number
  humidity: number
  windSpeed: number
  visibility: number
  condition: string
  description: string
}

// Mock weather conditions based on different regions of India
const getWeatherByRegion = (state: string): Partial<WeatherData> => {
  const weatherPatterns: Record<string, Partial<WeatherData>> = {
    // Northern Plains - Hot summers, cold winters
    Punjab: { temperature: 28, condition: "sunny", description: "Clear skies with warm weather" },
    Haryana: { temperature: 30, condition: "sunny", description: "Hot and dry conditions" },
    "Uttar Pradesh": { temperature: 32, condition: "partly cloudy", description: "Warm with occasional clouds" },
    Bihar: { temperature: 34, condition: "hot", description: "Very hot and humid" },

    // Western India - Arid and semi-arid
    Rajasthan: { temperature: 38, condition: "hot", description: "Extremely hot and dry desert climate" },
    Gujarat: { temperature: 35, condition: "sunny", description: "Hot and dry with clear skies" },
    Maharashtra: { temperature: 31, condition: "partly cloudy", description: "Warm with moderate humidity" },

    // Southern India - Tropical climate
    "Tamil Nadu": { temperature: 29, condition: "humid", description: "Hot and humid tropical weather" },
    Karnataka: { temperature: 27, condition: "pleasant", description: "Pleasant weather with mild temperatures" },
    Kerala: { temperature: 26, condition: "humid", description: "Warm and humid coastal climate" },
    "Andhra Pradesh": { temperature: 33, condition: "hot", description: "Hot and humid conditions" },
    Telangana: { temperature: 32, condition: "warm", description: "Warm and dry weather" },

    // Eastern India - Humid subtropical
    "West Bengal": { temperature: 30, condition: "humid", description: "Hot and humid with high moisture" },
    Odisha: { temperature: 32, condition: "humid", description: "Hot and humid coastal weather" },
    Jharkhand: { temperature: 28, condition: "pleasant", description: "Moderate temperatures with humidity" },

    // Northeastern India - Subtropical highland
    Assam: { temperature: 25, condition: "rainy", description: "Monsoon climate with frequent rainfall" },
    Meghalaya: { temperature: 22, condition: "rainy", description: "Cool and wet hill station weather" },
    Manipur: { temperature: 24, condition: "pleasant", description: "Pleasant hill climate" },
    Mizoram: { temperature: 23, condition: "cool", description: "Cool and pleasant mountain weather" },
    Nagaland: { temperature: 21, condition: "cool", description: "Cool hill station climate" },
    Tripura: { temperature: 26, condition: "humid", description: "Warm and humid subtropical climate" },
    "Arunachal Pradesh": { temperature: 20, condition: "cool", description: "Cool mountain climate" },

    // Central India
    "Madhya Pradesh": { temperature: 31, condition: "warm", description: "Warm and dry continental climate" },
    Chhattisgarh: { temperature: 29, condition: "pleasant", description: "Pleasant weather with moderate humidity" },

    // Mountain regions
    "Himachal Pradesh": { temperature: 18, condition: "cool", description: "Cool mountain weather" },
    Uttarakhand: { temperature: 20, condition: "pleasant", description: "Pleasant hill station climate" },
    Sikkim: { temperature: 16, condition: "cool", description: "Cool Himalayan climate" },

    // Coastal regions
    Goa: { temperature: 28, condition: "humid", description: "Warm and humid coastal weather" },
  }

  return (
    weatherPatterns[state] || { temperature: 25, condition: "pleasant", description: "Pleasant weather conditions" }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { city, state }: WeatherRequest = await request.json()

    if (!city || !state) {
      return NextResponse.json({ error: "City and state are required" }, { status: 400 })
    }

    // Get base weather pattern for the region
    const baseWeather = getWeatherByRegion(state)

    // Add some randomization to make it more realistic
    const tempVariation = Math.floor(Math.random() * 8) - 4 // ±4 degrees
    const humidityBase = Math.floor(Math.random() * 40) + 40 // 40-80%
    const windSpeedBase = Math.floor(Math.random() * 15) + 5 // 5-20 km/h
    const visibilityBase = Math.floor(Math.random() * 5) + 8 // 8-12 km

    const weatherData: WeatherData = {
      city,
      state,
      temperature: (baseWeather.temperature || 25) + tempVariation,
      humidity: humidityBase,
      windSpeed: windSpeedBase,
      visibility: visibilityBase,
      condition: baseWeather.condition || "pleasant",
      description: baseWeather.description || "Pleasant weather conditions",
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
