import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
    // We use useMoralis() HOOK here so we know to RE-RENDER ONLY WHEN
    // the user is connected to the Moralis server or if the user is disconnected.
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

    useEffect(() => {
        if (isWeb3Enabled) {
            return;
        }
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
        //enableWeb3();
        console.log("isWeb3Enabled: ", isWeb3Enabled);
    }, [isWeb3Enabled]);
    // If we leave [] empty, the useEffect will run every time the component is re-rendered.

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log("account changed: ", account);
            if (account == null) {
                window.localStorage.removeItem("connected");
                // This sets isWeb3Enabled to false
                deactivateWeb3();
                console.log("Null account found");
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>Connected to {account}</div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected");
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
}
