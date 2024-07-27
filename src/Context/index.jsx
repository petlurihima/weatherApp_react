import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Vadodara');
    const [thisLocation, setLocation] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchWeather = async () => {
        setLoading(true);
        const url = 'https://visual-crossing-weather.p.rapidapi.com/forecast';
        const options = {
            method: 'GET',
            url: url,
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'x-rapidapi-key': '4ffc1232e4msh3069bd38b31b17cp177db3jsn7055c39b2cea',
                'x-rapidapi-host': 'visual-crossing-weather.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const thisData = Object.values(response.data.locations)[0];
            setLocation(thisData.address);
            setValues(thisData.values);
            setWeather(thisData.values[0]);
        } catch (e) {
            console.error("Error fetching weather data:", e); 
            alert('This place does not exist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place]);

    return (
        <StateContext.Provider value={{ weather, setPlace, values, thisLocation, loading }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
