import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import '../App.css';
import {Form} from "../components/Form";
import ModalAddFlower from "../Modal/modalAddFlower";
import {Navigate} from "react-router-dom";
import {useNavigate} from 'react-router-dom';


interface userResourcesPage {
    "userId": string,
    "amount": string,
    "type": string,
    "resourceType": string
}

const typeResources = [
    {
        value: 'water',
        label: 'Вода'
    },
    {
        value: 'soil',
        label: 'Почва'
    },
    {
        value: 'fertilizers',
        label: 'Удобрения'
    }
]
const optionWater = [
    {
        value: 'crane',
        label: 'Водопроводная'
    },
    {
        value: 'rainy',
        label: 'Дождевая'
    },
    {
        value: 'mineral',
        label: 'Минеральная'
    },
    {
        value: 'bottled',
        label: 'Бутилированная'
    },
    {
        value: 'salty',
        label: 'Соляная'
    }]
const optionSoil = [
    {
        value: 'podzolic',
        label: 'Известковая'
    },
    {
        value: 'clay',
        label: 'Глинистая'
    },
    {
        value: 'sandy',
        label: 'Песчаная'
    },
    {
        value: 'peat',
        label: 'Торфяная'
    }]


const optionFertilizers = [
    {
        value: 'ammophos',
        label: 'Аммофос'
    },
    {
        value: 'nitrophoska',
        label: 'Нитрофоска'
    },
    {
        value: 'nitroammophoska',
        label: 'Нитроаммофоска'
    },
    {
        value: 'potassium_nitrate',
        label: 'Селитра калийная'
    },
    {
        value: 'organic',
        label: 'Органическое'
    }
]

const setWaters = (value: string) => {
    const foundOption = optionWater.find(c => c.value === value);
    if (foundOption) {
        const label = foundOption.label;
        return label;
    }
    return '';
}

const setSoils = (value: string) => {
    const foundOption = optionSoil.find(c => c.value === value);
    if (foundOption) {
        const label = foundOption.label;
        // Ваш код для использования label
        return label;
    }
    return '';
}

const setFertilizer = (value: string) => {
    const foundOption = optionFertilizers.find(c => c.value === value);
    if (foundOption) {
        const label = foundOption.label;
        return label;
    }
    return '';
}
const setResTypes = (value: string, tr: string) => {
    if (tr === "water") {
        const foundOption = optionWater.find(c => c.value === value);
        if (foundOption) {
            const label = foundOption.label;
            return label;
        }
    } else if (tr === "soil") {
        const foundOption = optionSoil.find(c => c.value === value);
        if (foundOption) {
            const label = foundOption.label;
            return label;
        }
    } else {
        const foundOption = optionFertilizers.find(c => c.value === value);
        if (foundOption) {
            const label = foundOption.label;
            return label;
        }
    }
    return '';
}
const setTypes = (value: string) => {
    const foundOption = typeResources.find(c => c.value === value);
    if (foundOption) {
        const label = foundOption.label;
        return label;
    }
    return '';
}
const ResourcesTable: React.FC = () => {
    const navigate = useNavigate();
    const [resourcesList, setResourcesList] = useState<userResourcesPage[]>([]);
    const [waterList, setWaterList] = useState<userResourcesPage[]>([]);
    const [soilList, setSoilsList] = useState<userResourcesPage[]>([]);
    const [fertilizersList, setFertilizersList] = useState<userResourcesPage[]>([]);
    const [modalActive, setModalActive] = useState(false);
    const [id, setId] = useState("");
    const [amount, setAmount] = useState("");
    const [resourceType, setResourceType] = useState("");
    const [type, setType] = useState("");



    const fetchData = async () => {
        console.log("------------------------------");
        try {
            const response: AxiosResponse<{ userResourcesPage: userResourcesPage[] }> = await axios.get(
                'http://localhost:8080/api/resources/100',
                {
                    headers: {'Access-Control-Allow-Origin': '*'},
                }
            );
            setResourcesList(response.data.userResourcesPage
            );
            setWaterList([]);
            setSoilsList([]);
            setFertilizersList([]);
            response.data.userResourcesPage.map((res, index) => {
                if (res.type === "water") {
                    const foundOption = waterList.findIndex(a => a.resourceType==res.resourceType);
                    if (foundOption===-1) {
                        waterList.push(res);
                    }
                    else {
                        waterList[foundOption].amount = res.amount;
                    }
                } else if (res.type === "soil") {
                    const foundOption = soilList.findIndex(a => a.resourceType==res.resourceType);
                    if (foundOption===-1) {
                        soilList.push(res);
                    }
                    else {
                        soilList[foundOption].amount = res.amount;
                    }
                } else {
                    const foundOption = fertilizersList.findIndex(a => a.resourceType==res.resourceType);
                    if (foundOption===-1) {
                        fertilizersList.push(res);
                    }
                    else {
                        fertilizersList[foundOption].amount = res.amount;
                    }
                }
            })
            setWaterList(waterList);
            setSoilsList(soilList);
            setFertilizersList(fertilizersList);
            console.log(response.data.userResourcesPage);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div className="body">
            <h4 onClick={()=> {
                navigate('/home');
            }
            }>Цветы</h4>
            <h4 onClick={()=> {
                navigate('/resurses');
            }
            }>Ресурсы</h4>
            <h4 onClick={()=> {
                navigate('/statistic');
            }
            }>Cтатистика</h4>
            <h1>Ресурсы</h1>
            <table className="none">
                <tr>
                    <td>
                        Вода
                    </td>
                    <td>
                        Почва
                    </td>
                    <td>
                        Удобрения
                    </td>
                </tr>
                <tr>
                    <td>
                        <table className="resources">
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
                            {
                                waterList.map((water) => (
                                    <tr key={water.type}>
                                        <td>{setWaters(water.resourceType)}</td>
                                        <td>{water.amount}</td>
                                        <td>
                                            <img src={require("../Image/edit.svg").default} onClick={() => {
                                                setModalActive(true);
                                                setType("water");
                                                setResourceType(water.resourceType);
                                                setAmount(water.amount);
                                                setId(water.userId);
                                            }
                                            }/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>


                    <td>
                        <table className="resources">
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
                            {
                                soilList.map((soil) => (
                                    <tr key={soil.type}>
                                        <td>{setSoils(soil.resourceType)}</td>
                                        <td>{soil.amount}</td>
                                        <td>
                                            <img src={require("../Image/edit.svg").default} onClick={() => {
                                                setModalActive(true);
                                                setType("soil");
                                                setResourceType(soil.resourceType);
                                                setAmount(soil.amount);
                                                setId(soil.userId);
                                            }
                                            }/>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </td>
                    <td>
                        <table className="resources">
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
                            {
                                fertilizersList.map((fertilizers) => (
                                    <tr key={fertilizers.type}>
                                        <td>{setFertilizer(fertilizers.resourceType)}</td>
                                        <td>{fertilizers.amount}</td>
                                        <td>
                                            <img src={require("../Image/edit.svg").default} onClick={() => {
                                                setModalActive(true);
                                                setType("fertilizers");
                                                setResourceType(fertilizers.resourceType);
                                                setAmount(fertilizers.amount);
                                                setId(fertilizers.userId);
                                            }
                                            }/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>

            <ModalAddFlower active={modalActive} setActive={setModalActive}>
                <table className="tableAdd">
                    <tr>
                        <h2 className="in">
                            {setTypes(type)}
                        </h2>
                    </tr>
                    <tr>
                        <td>
                            {setResTypes(resourceType, type)}
                        </td>
                        <td>
                            <input id="amount" type="text" value={amount} pattern="\d*"
                                   onChange={(e) => setAmount(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <button
                            className="but"
                            type="button"
                            onClick={async () => {
                                try {
                                    const response = await fetch('http://localhost:8080/api/resources/100', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            userId: id,
                                            amount,
                                            type,
                                            resourceType
                                        })
                                    });
                                    if (response.ok) {
                                        fetchData();
                                    } else {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }
                                    const data = await response.json();
                                    console.log(data);
                                } catch (e) {
                                    console.log('Sending error', e);
                                } finally {
                                    setModalActive(false);
                                }
                            }}
                        >
                            Применить
                        </button>
                    </tr>
                </table>

            </ModalAddFlower>

        </div>
    );

    return <Form title="resources" handleClick={fetchData}/>;
};
export {ResourcesTable};
