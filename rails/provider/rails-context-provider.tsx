import { createContext, useContext, useState } from "react";
import { signOutAction } from "@/app/actions";
// Global types are now imported from rails/types.d.ts

export interface RailsContextType {
    // Define the properties and methods you want to expose
    currentUser: any; // Replace 'any' with the actual type of your user object
    signOut: () => Promise<void>;
}


const RailsProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>('fernando');

    const signOut = async () => {
        console.log("Signing out from Rails context...");
        // Set local state to null
        setCurrentUser(null);
        // Call the server action to sign out
        await signOutAction();
    };

    // Only access window in client components and when it's available
    if (typeof window !== 'undefined') {
        window.test1 = 'test1';
    }

    // Create a value object with all the context data
    const contextValue = {
        currentUser,
        signOut,
        // Add any other shared functionality here
    };

    return (
        <RailsContext.Provider value={contextValue}>
            {children}
        </RailsContext.Provider>
    );
}

export const RailsContext = createContext<RailsContextType | undefined>(undefined);
export const useRailsContext = () => {
    const context = useContext(RailsContext);
    if (!context) {
        throw new Error("useRailsContext must be used within a RailsProvider");
    }
    return context;
}

export default RailsProvider;