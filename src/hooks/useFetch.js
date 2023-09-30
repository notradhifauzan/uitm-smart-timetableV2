import { useEffect, useRef, useState } from "react";

export const useFetch = (url,_body) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState("");
  const body = useRef(_body);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(url);
        if(!response.ok){
          throw new Error(response.statusText);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.log(error.message);
        setError(error.message);
      }
      setLoading(false);
    }

    fetchData();
  }, [url,body])

  return { data, loading,error }
}
