// import { Search } from "@mui/icons-material";
// import { InputAdornment, TextField } from "@mui/material";
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SearchComponent = () => {
//     const navigate = useNavigate();
//     const [searchQuery, setSearchQuery] = useState("");

//     const handleSearch = async (event: React.FormEvent) => {
//         event.preventDefault();
//         if (!searchQuery.trim()) return;

//         const token = localStorage.getItem("token");
//         console.log("🔍 Sending Request with Token:", token);

//         try {
//             const response = await axios.get(`/customers/search`, {
//                 params: { query: searchQuery },
//                 headers: {
//                     Authorization: `Bearer ${token}`,  // Attach token
//                 }
//             });

//             if (response.status === 200) {
//                 navigate(`customer-details/${response.data.accountid}`);
//             } else {
//                 alert("Customer not found");
//             }
//         } catch (error) {
//             console.error("Search error:", error);
//             alert("Error searching customer");
//         }
//     };


//     return (
//         <form onSubmit={handleSearch}>
//             <TextField
//                 size="small"
//                 variant="outlined"
//                 placeholder="Search Customer..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <Search />
//                         </InputAdornment>
//                     ),
//                 }}
//             />
//         </form>
//     );
// };

// export default SearchComponent;

import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            alert("Please enter a valid search term.");
            return;
        }

        // try {
        //     const token = localStorage.getItem("token");
        //     console.log("🔍 Sending Request with Token:", token);

        //     const response = await axios.get(`/customers/search`, {
        //         params: { query: searchQuery.trim() },
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         }
        //     });

        //     if (response.status === 200 && response.data.accountid) {
        //         // Navigate to customer details page
        //         navigate(`/customer-details/${response.data.accountid}`);
        //     } else {
        //         alert("Customer not found");
        //     }
        // } catch (error) {
        //     console.error("Search error:", error);
        //     alert("Error searching customer");
        // }
        try {
            const token = localStorage.getItem("token");
            console.log("🔍 Sending Request with Token:", token);

            const response = await axios.get(`/customers/search`, {
                params: { query: searchQuery.trim() },
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("🔍 API Response:", response);
            console.log("🔍 API Response Data:", response.data);

            if (response.status === 200 && response.data.accountid) {
                navigate(`/customer-details/${response.data.accountid}`);
            } else {
                alert("Customer not found");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("Error searching customer");
        }

    };

    return (
        <form onSubmit={handleSearch}>
            <TextField
                size="small"
                variant="outlined"
                placeholder="Search Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />
        </form>
    );
};

export default SearchComponent;
