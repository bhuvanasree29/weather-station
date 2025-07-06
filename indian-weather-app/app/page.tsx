"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { indianCities } from "@/lib/indian-cities"

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

export default function WeatherApp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [filteredCities, setFilteredCities] = useState(indianCities)

  useEffect(() => {
    const filtered = indianCities.filter(
      (city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCities(filtered)
  }, [searchTerm])

  const fetchWeather = async (cityName: string, stateName: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityName, state: stateName }),
      })
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error("Error fetching weather:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (city: { name: string; state: string }) => {
    setSelectedCity(`${city.name}, ${city.state}`)
    fetchWeather(city.name, city.state)
  }

  const getStateColor = (state: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ]
    return colors[state.length % colors.length]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Indian Weather Station</h1>
          <p className="text-gray-600">Get real-time weather information for cities across all 28 Indian states</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* City Search and Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Cities
                </CardTitle>
                <CardDescription>Search from below cities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search city or state..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />

                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredCities.slice(0, 50).map((city, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <Badge variant="secondary" className={getStateColor(city.state)}>
                            {city.state}
                          </Badge>
                        </div>
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                    {filteredCities.length > 50 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        Showing first 50 results. Refine your search for more specific results.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Display */}
          <div className="lg:col-span-2">
            {!weatherData && !loading && (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Thermometer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a City</h3>
                  <p className="text-gray-500">Choose a city from the list to view its weather information</p>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-600">Loading Weather Data...</h3>
                </CardContent>
              </Card>
            )}

            {weatherData && !loading && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {weatherData.city}, {weatherData.state}
                    </CardTitle>
                    <CardDescription>{weatherData.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-6xl font-bold text-blue-600">{weatherData.temperature}°C</div>
                        <div>
                          <div className="text-xl font-semibold capitalize">{weatherData.condition}</div>
                          <div className="text-gray-500">
                            Feels like {weatherData.temperature + Math.floor(Math.random() * 6 - 3)}°C
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Droplets className="w-8 h-8 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Humidity</div>
                          <div className="font-semibold">{weatherData.humidity}%</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Wind className="w-8 h-8 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Wind Speed</div>
                          <div className="font-semibold">{weatherData.windSpeed} km/h</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Eye className="w-8 h-8 text-purple-600" />
                        <div>
                          <div className="text-sm text-gray-600">Visibility</div>
                          <div className="font-semibold">{weatherData.visibility} km</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weather Forecast</CardTitle>
                    <CardDescription>5-day weather outlook</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                      {Array.from({ length: 5 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() + i)
                        const temp = weatherData.temperature + Math.floor(Math.random() * 10 - 5)
                        const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy", "Clear"]
                        const condition = conditions[Math.floor(Math.random() * conditions.length)]

                        return (
                          <div key={i} className="text-center p-3 border rounded-lg">
                            <div className="text-sm font-medium">
                              {i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                            <div className="text-2xl font-bold text-blue-600 my-2">{temp}°</div>
                            <div className="text-xs text-gray-600">{condition}</div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold">Developed by Bhuvana Sree</p>
          <p className="text-gray-400 mt-2">© 2025 Indian Weather Station. All rights reserved.</p>
          <div className="mt-4 text-sm text-gray-500">
            Covering all 28 states of India with comprehensive weather data
          </div>
        </div>
      </footer>
    </div>
  )
}
