// Example: Billing.tsx
import React from "react";

interface SpotlightProps {
    data: unknown; // Replace 'any' with a proper type
}
const Spotlight: React.FC<SpotlightProps> = ({ data }) => {
    if (!data) return <div>No Spotlight Data Available</div>;

    return (
        <div>
            <h3>Spotlight Details</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Spotlight;
