import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

// Fallback hardcoded admin emails in case DB role hasn't been set yet
const ADMIN_EMAILS = ['iotgcet2024@gmail.com', 'mdaahidsiddiqui@gmail.com', 'admin@gcetiot.com', '24r11a0535@gcet.edu.in'];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (!error && data) setProfile(data);
        } catch {
            // silently fail - profile fetch is non-critical
        }
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) await fetchProfile(sessionUser.id);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);
                if (sessionUser) {
                    await fetchProfile(sessionUser.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // isAdmin: true if DB role is 'admin' OR email is in the fallback list
    const isAdmin = !!(
        profile?.role === 'admin' ||
        (user && ADMIN_EMAILS.includes(user.email))
    );

    const signUp = async (email, password, displayName, rollNumber, department) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                    roll_number: rollNumber,
                    department: department
                }
            }
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data, error };
    };

    const signOut = async () => {
        setProfile(null);
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const value = { signUp, signIn, signOut, user, profile, isAdmin, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
