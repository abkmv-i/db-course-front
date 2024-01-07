import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import '../App.css';
import {Form} from "../components/Form";
import {useNavigate} from "react-router-dom";

interface Statictics {
    "height": string,
    "flowerCount": string,
    "popularDiseases": string,
    "flowersCountBySpecies": string,
    "countDiseasedFlower": string,
    "perfectFlowerCount": string
}


const Statictic: React.FC = () => {
    const navigate = useNavigate();
    const [staticticList, setStaticticList] = useState<Statictics[]>([]);
    const fetchData = async () => {
        try {
            const response: AxiosResponse<{ staticticList: Statictics[] }> = await axios.get(
                'http://localhost:8080/api/flowers/100/statistic',
                {
                    headers: {'Access-Control-Allow-Origin': '*'},
                }
            );
            setStaticticList((response.data.staticticList));
            console.log(response.data.staticticList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div className="body">
            <h4 onClick={() => {
                navigate('/home');
            }
            }>Цветы</h4>
            <h4 onClick={() => {
                navigate('/resurses');
            }
            }>Ресурсы</h4>
            <h4 onClick={() => {
                navigate('/statistic');
            }
            }>Cтатистика</h4>
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
                                <th>
                                    Наиболее часто встречающийся тип болезни у растения
                                </th>
                                <th>
                                    Количествао растений, подвергшихся заражению за последнюю неделю
                                </th>
                            </tr>
                            </thead>
                            <tbody>

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
