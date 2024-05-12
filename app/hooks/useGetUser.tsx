import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

function useGetUser() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define the function to fetch user data
        const fetchUser = async () => {
            setLoading(true);
            try {
                // Replace 'API_URL' with your actual API endpoint
                const { data, error } = await supabase.auth.getUser()

                if (error) throw new Error(error.message)

                setUser(data.user);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        // Call the fetchUser function
        fetchUser();

        // Clean-up function
        return () => {
            // Cleanup code if needed (e.g., cancel fetch request)
        };
    }, []);

    return { user, loading, error };
}

export default useGetUser;