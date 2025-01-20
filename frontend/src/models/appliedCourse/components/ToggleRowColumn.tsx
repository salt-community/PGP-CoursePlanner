type ToggleButtonProps = {
    isColumn: boolean;
    toggleLayout: () => void;
};

export default function ToggleRowColumn({ isColumn, toggleLayout }: ToggleButtonProps) {
    return (
        <div style={{ display: "flex" }}>
            <button
                onClick={toggleLayout}
                disabled={isColumn}
                style={{
                    opacity: isColumn ? 0.5 : 1,
                    cursor: isColumn ? "not-allowed" : "pointer",
                    border: "2px solid #ccc", 
                    borderRight: "none", 
                    borderRadius: "8px 0 0 8px",
                    backgroundColor:"#f0f0f0",
                    padding: "2px",
                    transition: "background-color 0.3s, border-color 0.3s",
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 30 48"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 7.5h15a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25Z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 24h15a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1-2.25-2.25Z"
                    />
                </svg>
            </button>

            <button
                onClick={toggleLayout}
                disabled={!isColumn}
                style={{
                    opacity: !isColumn ? 0.5 : 1,
                    cursor: !isColumn ? "not-allowed" : "pointer",
                    border: "2px solid #ccc",
                    borderLeft: "none", 
                    borderRadius: "0 8px 8px 0", 
                    backgroundColor:"#f0f0f0",
                    padding: "2px",
                    transition: "background-color 0.3s, border-color 0.3s",
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 48 30"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 5.25v15a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 7.5 5.25Z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M24 5.25v15a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 24 5.25Z"
                    />
                </svg>
            </button>
        </div>
    );
}
