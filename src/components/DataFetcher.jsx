// src/components/DataFetcher.jsx
import { useEffect } from 'react';

export default function DataFetcher() { // 👈 sin props
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userCode = params.get('ir'); // 👈 lee directo del browser

    async function fetchData() {
      try {
        const cachedId = sessionStorage.getItem('id-ref');
        const cachedData = sessionStorage.getItem('yt-vid-urls');

        if (cachedId === userCode && cachedData) {
          return;
        }

        const res = await fetch(`http://localhost:8000/dashboard/prospect-page-config/${userCode}`);
        if (!res.ok) return;

        const data = await res.json();

        sessionStorage.setItem('yt-vid-urls', JSON.stringify(data));
        sessionStorage.setItem('id-ref', userCode);
        window.dispatchEvent(new Event('session-ready'));

      } catch (error) {
        console.error('Error:', error);
      }
    }

    if (userCode) fetchData();
  }, []);

  return null;
}