import os
import requests

# Prompt the user to enter the name of the city
city = input("Enter the name of the city: ")

# Retrieve the API key from the operating system environment variables
api_key = os.environ.get("YOUR_API_KEY")

# Make an API call to the Geocoding API to get the latitude and longitude coordinates of the specified city
geocoding_url = f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
response = requests.get(geocoding_url)
geocoding_data = response.json()

# Check if the city was found in the Geocoding API response
if not geocoding_data:
    print("City not found.")
else:
    # Extract the latitude and longitude coordinates
    latitude = geocoding_data[0]['lat']
    longitude = geocoding_data[0]['lon']

    # Make an API call to the OpenWeatherMap API to fetch the current weather data
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&units=metric&appid={api_key}"
    response = requests.get(weather_url)
    weather_data = response.json()

    # Extract the relevant weather information
    temperature = weather_data['main']['temp']
    humidity = weather_data['main']['humidity']
    wind_speed = weather_data['wind']['speed']
    description = weather_data['weather'][0]['description']

    # Display the retrieved weather information
    print(f"Weather in {city}:")
    print(f"- Temperature: {temperature}°C")
    print(f"- Humidity: {humidity}%")
    print(f"- Wind Speed: {wind_speed} m/s")
    print(f"- Description: {description}")
