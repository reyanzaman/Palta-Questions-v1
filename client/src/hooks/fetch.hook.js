import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

// axios.defaults.baseURL = 'https://iub-qbl.onrender.com';
axios.defaults.baseURL = 'http://localhost:8080/';

/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));

                const { username } = !query ? await getUsername() : '';
                
                const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);

                if(status === 200){
                const apiData = { ...data };
                apiData.profile = typeof data.profile === 'string' ? data.profile : '';
                setData(prev => ({ ...prev, isLoading: false, apiData, status: status }));
                }
                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}
