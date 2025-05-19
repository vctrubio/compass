
import { createContext, useContext, useState } from "react";



interface RailsContextType {
    // Define the properties and methods you want to expose
    currentUser: any; // Replace 'any' with the actual type of your user object
    signOut: () => Promise<void>;
}


const RailsProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>('fernando');

    const signOut = async () => {
        console.log("Signing out...");
        setCurrentUser(null);
    };

    window.test1 = 'test1';

    return (
        <RailsContext.Provider value={{ currentUser, signOut }}>
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