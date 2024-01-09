import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import '../App.css';
import {Form} from "../components/Form";
import {useNavigate} from "react-router-dom";

interface FLower {
    flowerSpices: string;
    count: string;
}

interface Statictics {
    "height": string,
    "flowerCount": string,
    "popularDiseases": string,
    "flowersCountBySpecies": FLower[],
    "countDiseasedFlower": string,
    "perfectFlowerCount": string
}


const Statictic: React.FC = () => {
    const navigate = useNavigate();
    const [staticticList, setStaticticList] = useState<Statictics[]>([]);
    const fetchData = async () => {
        try {
            const response: AxiosResponse<{ staticticList: Statictics[] }> = await axios.get(
                'http://localhost:8080/api/flowers/statistic',
                {
                    headers: {'Access-Control-Allow-Origin': '*'},
                }
            );
            setStaticticList(response.data.staticticList);
            staticticList[0].flowerCount = response.data.staticticList[0].flowerCount;
            staticticList[0].height = response.data.staticticList[0].height;
            staticticList[0].perfectFlowerCount = response.data.staticticList[0].perfectFlowerCount;
            staticticList[0].flowersCountBySpecies = response.data.staticticList[0].flowersCountBySpecies;
            response.data.staticticList[0].flowersCountBySpecies.map((flower, index)=>{
                const foundOption = staticticList[0].flowersCountBySpecies.findIndex(a => a.flowerSpices == flower.flowerSpices);
                if (foundOption === -1) {
                    staticticList[0].flowersCountBySpecies.push(flower);
                } else {
                    staticticList[0].flowersCountBySpecies[foundOption].flowerSpices = flower.flowerSpices;
                    staticticList[0].flowersCountBySpecies[foundOption].count = flower.count;
                }
            })
            setStaticticList(staticticList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div className="body">
            <br/>
            <button className="navigates"
                    type="button"
                    onClick={async () => {
                        navigate('/homeAdmin');
                    }}>Цветы
            </button>
            <h1>Статистика</h1>
            <table className="none">
                <tr>
                    <td>
                        <table className="flower">
                            <thead>
                            <tr>
                                <th>
                                    Количество всех растений
                                </th>
                                <th>
                                    Средняя высота растений
                                </th>
                                <th>
                                    Количество растений, находящихся в идеальной среде
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <td>{staticticList[0].flowerCount
                            }</td>
                            <td>{staticticList[0].height
                            }</td>
                            <td>{staticticList[0].perfectFlowerCount
                            }</td>

                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>
            <h2>Cтатистика по видам</h2>
            <table className="none">
                <tr>
                    <td>
                        <table className="flower">
                            <thead>
                            <tr>
                                <th>
                                    Название
                                </th>
                                <th>
                                    Количество
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {staticticList[0].flowersCountBySpecies.map((flower, index) => (
                                <tr key={flower.flowerSpices}>
                                    <td>{flower.flowerSpices}</td>
                                    <td>{flower.count}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>

        </div>
    );

    return <Form title="statistic" handleClick={fetchData}/>;
};
export {Statictic};
