import React, {useState, useEffect} from 'react';
import { 
    FormControl, 
    MenuItem, 
    Select, 
    Card,
    CardContent,
} from '@material-ui/core';
import InfoBox from './coms/InfoBox';
import Map from './coms/Map';
import './styles/App.css';

function App() {

    // STATE = How to write a variable in REACT <<<<<
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("Worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    
    // API REFERENCES
    // https://disease.sh/v3/covid-19/countries
    // https://disease.sh/v3/covid-19/all


    // USEFFECT = Runs code based on a given condition

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then(response => response.json())
            .then(data => {
                setCountryInfo(data);
            });
    }, []);


    //ASYNC API CALL INSIDE USE EFFECT--------------------------------------
    useEffect(() => {
        //Code inside here will run once
        //when the comment loads and not again
        // asnyc -> send a request, wait for it, do something with response
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((country) => ({
                        name: country.country, // United States, United Kingdom
                        value: country.countryInfo.iso2 //UK, USA, FR
                    }));

                    setTableData(data);
                    setCountries(countries);
            });
        };
        getCountriesData();
    }, []);
    //---------------------------------------------------------------------------

    const onCountryChange = async (e) => {
        const countryCode = e.target.value;
        setCountry(countryCode);

        const url = countryCode === 'worldwide' 
            ? 'https://disease.sh/v3/covid-19/all' 
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);

                // All of the data from the country
                setCountryInfo(data);
            });
    };

    console.log('COUNTRY INFO >>>', countryInfo);
    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" onChange={onCountryChange} value={country}>
                            <MenuItem value="Worldwide">Worldwide</MenuItem>
                            {/* Loop through all countries and get dropdown of countries */}

                            {
                                countries.map((country => (
                                    <MenuItem value={country.value}>{country.name}</MenuItem>
                                )))
                            }

                            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
                        
                            <MenuItem value="worldwide">Option 3</MenuItem>
                            <MenuItem value="worldwide">Yooo</MenuItem> */}

                        </Select>
                    </FormControl>       
                </div>
                <div className="app__stats">
                    <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
                    <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
                    <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
                </div>

                    {/* Map */}
                    <Map />


            </div>
            <Card className="app__right">
                <CardContent>
                    <h3>Live Cases by Country</h3>
                    <Table countries={tableData} />

                    <h3>Worldwide new cases</h3>
                    {/* Graph */}

                </CardContent>
                
                

            </Card>
        </div>
    );
}

export default App;
