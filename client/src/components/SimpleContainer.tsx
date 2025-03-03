import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
}

type Customer = {
    accountid: string;
    accounttype: "Residential" | "Business";
    name: string;
    email: string;
    mainphone: string;
    country: string;
    pricelist: "Basic" | "Standard" | "Premium" | "Enterprise";
};

const GetUsers = async (): Promise<User[]> => {
    try {
        const result = await fetch("http://127.0.0.1:8000/users/users");
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        const data = await result.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

//Customers complete
const GetCustomers = async (): Promise<Customer[]> => {
    try {
        const result = await fetch("http://127.0.0.1:8000/customers/customers");
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        const data = await result.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default function SimpleContainer() {

    const [users, setUsers] = useState<User[]>([]); // State to store the users
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState<string | null>(null); // State to store errors (can be string or null)


    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        // Call the GetUsers function when the component mounts
        const fetchUsers = async () => {
            try {
                const usersData = await GetUsers();
                setUsers(usersData);
            } catch (error) {
                setError(`Failed to fetch users`)
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        const fetchCustomers = async () => {
            try {
                const usersData = await GetCustomers();
                setCustomers(usersData);
            } catch (error) {
                setError(`Failed to fetch users`)
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        fetchCustomers();
    }, []); // Empty dependency array means this runs only once when the component mounts 

    // Render JSX
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
                    <div>
                        <h1>Users List</h1>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    {user.name} - {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1>Customers List</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Account ID</th>
                                    <th>Account Type</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Main Phone</th>
                                    <th>Country</th>
                                    <th>Price List</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.accountid}>
                                        <td>{customer.accountid}</td>
                                        <td>{customer.accounttype}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.mainphone}</td>
                                        <td>{customer.country}</td>
                                        <td>{customer.pricelist}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Box>
            </Container>
        </React.Fragment>
    );
}
