import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import axios, {AxiosResponse} from 'axios';
import '../App.css';
import ModalAddFlower from "../Modal/modalAddFlower";
import {Navigate, useNavigate} from "react-router-dom";


interface Flower {
    id: string;
    userId: string;
    flowerSpecies: string;
    soil: string;
    fertilizerType: string;
    waterType: string;
    height: string;

}

interface WaterSchedule {
    id: string;
    userId: string;
    "needWater": boolean,
    "nextWatering": string
}

interface FlowerParam {
    id: string;
    userId: string;
    soil: boolean;
    fertilizerType: boolean;
    waterType: boolean;
}


const optionSoil = [
    {
        value: 'podzolic',
        label: 'Известковая'
    },
    {
        value: 'clayey',
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


const FlowerTable: React.FC = () => {
        const navigate = useNavigate();
        const [id, setId] = useState('');
        const [userID, setUserID] = useState('');
        const [flowerList, setFlowerList] = useState<Flower[]>([]);
        const [modalActive, setModalActive] = useState(false);
        const [inputName, setInputName] = useState('');
        const [height, setHeight] = useState('');
        const [currentSoil, setSoil] = useState('');
        const [currentWater, setWater] = useState('');
        const [currentFertilizers, setFertilizers] = useState('');
        const [flowerParamState, setFlowerParamState] = useState<FlowerParam[]>([]);
        const [waterSchedule, setWaterSchedule] = useState<WaterSchedule[]>([]);
        const [ind, setInd] = useState(-1);

        const setSoils = (value: string) => {
            const foundOption = optionSoil.find(c => c.value === value);
            if (foundOption) {
                const label = foundOption.label;
                // Ваш код для использования label
                return label;
            }
            return '';
        }

        const setWaters = (value: string) => {
            const foundOption = optionWater.find(c => c.value === value);
            if (foundOption) {
                const label = foundOption.label;
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


        const setHeights = (event: string) => {
            const inputValue = event.replace(/\D/g, '');
            setHeight(inputValue);
        }
        const getValueSoil = () => {
            return currentSoil ? optionSoil.find(c => c.value === currentSoil) : ''
        }
        const getValueWater = () => {
            return currentWater ? optionWater.find(c => c.value === currentWater) : ''
        }


        const getValueFertilizers = () => {
            return currentFertilizers ? optionFertilizers.find(c => c.value === currentFertilizers) : ''
        }

        const onChangeSoil = (newValue: any) => {
            setSoil(newValue.value)
        }

        const onChangeWater = (newValue: any) => {
            setWater(newValue.value)
        }

        const onChangeFertilizers = (newValue: any) => {
            setFertilizers(newValue.value)
        }

        const findWaterShed = (value: any, n: any) => {
            if (flowerList.length != 0) {
                const foundOption = waterSchedule.findIndex(a => a.id === flowerList[value - 1].id);
                if (foundOption === -1) {
                    return "";
                }
                if (n === 1) {
                    return waterSchedule[foundOption].needWater;
                } else if (n === 2) {
                    return waterSchedule[foundOption].nextWatering;
                }
            }
        }

        const findBestFlow = (value: any, n: any) => {
            if (flowerList.length != 0) {
                const foundOption = flowerParamState.findIndex(a => a.id === flowerList[value - 1].id);
                if (foundOption === -1) {
                    return "";
                }
                if (n === 1) {
                    return flowerParamState[foundOption].soil;
                } else if (n === 2) {
                    return flowerParamState[foundOption].waterType;
                } else if (n === 3) {
                    return flowerParamState[foundOption].fertilizerType;
                }
            }
        }


        const fetchData = async () => {
            try {
                const response: AxiosResponse<{ flowerList: Flower[] }> = await axios.get(
                    'http://localhost:8080/api/flowers/100/flowers',
                    {
                        headers: {'Access-Control-Allow-Origin': '*'},
                    }
                );
                console.log(response);
                setFlowerList(response.data.flowerList);
                response.data.flowerList.map((res, index) => {
                    const foundOption = flowerList.findIndex(a => a.id == res.id);
                    if (foundOption === -1) {
                        flowerList.push(res);
                    } else {
                        flowerList[foundOption].flowerSpecies = res.flowerSpecies;
                        flowerList[foundOption].waterType = res.waterType;
                        flowerList[foundOption].soil = res.soil;
                        flowerList[foundOption].fertilizerType = res.fertilizerType;
                        flowerList[foundOption].height = res.height;
                    }
                    setFlowerList(flowerList);
                    fetchDataComparasion();
                    fetchWaterShedule();
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataComparasion = async () => {
            try {
                const response: AxiosResponse<{ isExpected: FlowerParam[] }> = await axios.get(
                    'http://localhost:8080/api/flowers/100/flowers/check',
                    {
                        headers: {'Access-Control-Allow-Origin': '*'},
                    }
                );
                setFlowerParamState(response.data.isExpected);
                response.data.isExpected.map((res, index) => {
                    const foundOption = flowerParamState.findIndex(a => a.id == res.id);
                    if (foundOption === -1) {
                        flowerParamState.push(res);
                    } else {
                        flowerParamState[foundOption].waterType = res.waterType;
                        flowerParamState[foundOption].soil = res.soil;
                        flowerParamState[foundOption].fertilizerType = res.fertilizerType;
                    }
                    setFlowerParamState(flowerParamState);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchWaterShedule = async () => {
            try {
                const respons: AxiosResponse<{ waterSchedule: WaterSchedule[] }> = await axios.get(
                    'http://localhost:8080/api/flowers/100/flowers/water',
                    {
                        headers: {'Access-Control-Allow-Origin': '*'},
                    }
                );
                console.log(respons);
                setWaterSchedule(respons.data.waterSchedule);
                respons.data.waterSchedule.map((res, index) => {
                    const foundOption = waterSchedule.findIndex(a => a.id == res.id);
                    if (foundOption === -1) {
                        waterSchedule.push(res);
                    } else {
                        waterSchedule[foundOption].needWater = res.needWater;
                        waterSchedule[foundOption].nextWatering = res.nextWatering;
                    }
                    setWaterSchedule(waterSchedule);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        useEffect(() => {
            fetchData()

        }, []);
        return (
            <div className="body">
                <br/>
                <button className="navigates"
                        type="button"
                        onClick={async () => {
                            navigate('/resurses');
                        }}>Ресурсы
                </button>
                <div className="container">
                    <div className="cont">
                        <img className="grut" src={require("../Image/gruti.svg").default} onClick={() => {
                            setInputName('');
                            setHeight('')
                            onChangeSoil('');
                            onChangeWater('');
                            onChangeFertilizers('');
                            setModalActive(true)
                        }
                        }/>

                    </div>
                    <table className="flower">
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Почва</th>
                            <th>Вода</th>
                            <th>Удобрение</th>
                            <th>Высота</th>
                            <th>Дата полива</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            flowerList.map((flower, index) => (
                                <tr key={flower.id}>
                                    <td>{flower.flowerSpecies}</td>
                                    <td style={{color: !findBestFlow(flower.id, 1) ? 'red' : 'white'}}>
                                        {setSoils(flower.soil)}
                                    </td>
                                    <td style={{color: !findBestFlow(flower.id, 2) ? 'red' : 'white'}}>
                                        {setWaters(flower.waterType)}</td>
                                    <td style={{color: !findBestFlow(flower.id, 3) ? 'red' : 'white'}}>
                                        {setFertilizer(flower.fertilizerType)}</td>
                                    <td>{flower.height}</td>
                                    <td>{findWaterShed(flower.id, 2)}
                                        {findWaterShed(flower.id, 1)}
                                        {findWaterShed(flower.id, 1) === true ? (
                                            <button
                                                className="waterShed"
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(`http://localhost:8080/api/flowers/100/flowers/water/flowers?flowerId=${flower.id}`, {
                                                            method: 'GET',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            }
                                                        });
                                                        if (response.ok) {
                                                            fetchWaterShedule();
                                                        } else {
                                                            throw new Error(`HTTP error! Status: ${response.status}`);
                                                        }

                                                    } catch (e) {
                                                        console.log('Sending error', e);
                                                    }
                                                }}
                                            >
                                                Полить
                                            </button>
                                        ) : (
                                            <p></p>
                                        )}
                                    </td>
                                    <td>
                                        <img src={require("../Image/edit.svg").default} onClick={() => {
                                            setModalActive(true);
                                            setId(flower.id)
                                            setInputName(flower.flowerSpecies);
                                            setSoil(flower.soil);
                                            setWater(flower.waterType);
                                            setFertilizers(flower.fertilizerType);
                                            setHeight(flower.height);
                                            setInd(index);
                                        }
                                        }/>
                                    </td>
                                    <td>
                                        <img src={require("../Image/delete.svg").default} onClick={async () => {
                                            setId(flower.id);
                                            setUserID(flower.userId);
                                            try {
                                                const response = await fetch(`http://localhost:8080/api/flowers/100/flowers?flowerId=${flower.id}`, {
                                                    method: 'DELETE',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                });

                                                if (response.ok) {
                                                    delete flowerList[index];
                                                    fetchData();
                                                } else {
                                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                                }

                                                const data = await response.json();
                                                return data;
                                            } catch (e) {
                                                console.log('Sending error', e);
                                            }
                                        }}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ModalAddFlower active={modalActive} setActive={setModalActive}>
                        <table className="tableAdd">
                            <tr>
                                <td>
                                    <p>Название</p>
                                    <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}/>
                                </td>
                                <td>
                                    <p>Рост</p>
                                    <input id="height" type="text" value={height} pattern="\d*"
                                           onChange={(e) => setHeights(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Почва</p>
                                    <Select classNamePrefix="select_type" onChange={onChangeSoil} value={getValueSoil()}
                                            options={optionSoil}/></td>
                                <td>
                                    <p>Вода</p>
                                    <Select classNamePrefix="select_type" onChange={onChangeWater} value={getValueWater()}
                                            options={optionWater}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Удобрения</p>
                                    <Select classNamePrefix="select_type" onChange={onChangeFertilizers}
                                            value={getValueFertilizers()}
                                            options={optionFertilizers}/>
                                </td>
                                <td>
                                    <button
                                        className="centerButton"
                                        disabled={inputName.length === 0}
                                        type="button"
                                        onClick={async () => {
                                            setId((flowerList.length + 1).toString());
                                            try {
                                                const response = await fetch('http://localhost:8080/api/flowers/100/flowers/add', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        id,
                                                        flowerSpecies: inputName,
                                                        soil: currentSoil,
                                                        waterType: currentWater,
                                                        fertilizerType: currentFertilizers,
                                                        height
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
                                                setInputName('');
                                                setHeight('');
                                                onChangeSoil('');
                                                onChangeWater('');
                                                onChangeFertilizers('');
                                                setModalActive(false);
                                            }
                                        }}
                                    >
                                        Применить
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </ModalAddFlower>
                </div>
            </div>
        );
        <Navigate to="/login"/>

    }
;

export default FlowerTable;
