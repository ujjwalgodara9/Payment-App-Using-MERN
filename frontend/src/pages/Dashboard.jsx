import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios";
import { useEffect, useState } from "react";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [name, setName] = useState("");
    //const id = searchParams.get("id");

    // useEffect(() => {
    //     axios.get("http://localhost:3000/api/v1/account/balance", {
    //         params: {
    //             id: localStorage.getItem("userId")
    //         }
    //     }).then((response) => {
    //         setBalance(response.data.balance);
    //     });
    // }, [balance]);

    return (
        <div>
            <Appbar name={name}/>
            <div className="m-8">
                
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
}