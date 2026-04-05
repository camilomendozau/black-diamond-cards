// hooks/useProspectData.js

import { useState, useEffect } from 'react';
import analytics from '../analytics/analytics';

export function useProspectData() {
    const [prospectData, setProspectData] = useState({
        loading: true,
        exists: false,
        hasCompleteData: false,
        prospect: null
    });

    useEffect(() => {
        checkProspect();
    }, []);

    const checkProspect = async () => {
        try {
            const data = await analytics.checkProspectData();
            setProspectData({
                loading: false,
                exists: data.exists,
                hasCompleteData: data.has_complete_data,
                prospect: data.prospect
            });
        } catch (error) {
            console.error('Error checking prospect:', error);
            setProspectData({
                loading: false,
                exists: false,
                hasCompleteData: false,
                prospect: null
            });
        }
    };

    const refetch = () => {
        setProspectData(prev => ({ ...prev, loading: true }));
        checkProspect();
    };

    return { ...prospectData, refetch };
}