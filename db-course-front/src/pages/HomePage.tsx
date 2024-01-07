import { Navigate } from 'react-router-dom'; // Import Navigate instead of Redirect
import { removeUser } from '../store/slices/userSlice';
import FlowerTable from "./FlowerTable";
import '../App.css';

const HomePage = () => {
    return(
        <div>
            <FlowerTable/>
        </div>
    );

};

export default HomePage;
