import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import axios, {AxiosResponse} from 'axios';
import '../App.css';
import ModalAddFlower from "../Modal/modalAddFlower";
import {Navigate, useNavigate} from "react-router-dom";


interface Flower {
    flowerSpecies: string;
    soil: string;
    fertilizerType: string;
    waterType: string;
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


const FlowerTableAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [flowerList, setFlowerList] = useState<Flower[]>([]);
    const [modalActive, setModalActive] = useState(false);
    const [inputName, setInputName] = useState('');
    const [currentSoil, setSoil] = useState('');
    const [currentWater, setWater] = useState('');
    const [currentFertilizers, setFertilizers] = useState('');

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


    const fetchData = async () => {
        try {
            const response: AxiosResponse<{ flowerList: Flower[] }> = await axios.get(
                'http://localhost:8080/api/admin/best_env',
                {
                    headers: {'Access-Control-Allow-Origin': '*'},
                }
            );
            console.log(response);
            setFlowerList(response.data.flowerList);
            response.data.flowerList.map((res, index) => {
                const foundOption = flowerList.findIndex(a => a.flowerSpecies == res.flowerSpecies);
                if (foundOption === -1) {
                    flowerList.push(res);
                } else {
                    flowerList[foundOption].waterType = res.waterType;
                    flowerList[foundOption].soil = res.soil;
                    flowerList[foundOption].fertilizerType = res.fertilizerType;
                }
                setFlowerList(flowerList);
            })
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
                        navigate('/resursesAdmin');
                    }}>Ресурсы
            </button>
            <button className="navigates"
                    type="button"
                    onClick={async () => {
                        navigate('/statistic');
                    }}>Статистика
            </button>

            <div className="container">
                <div className="cont">
                    <img className="grut" src={require("../Image/gruti.svg").default} onClick={() => {
                        setInputName('');
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
                            <tr key={flower.flowerSpecies}>
                                <td>{flower.flowerSpecies}</td>
                                <td>{setSoils(flower.soil)}</td>
                                <td>{setWaters(flower.waterType)}</td>
                                <td>{setFertilizer(flower.fertilizerType)}</td>

                                <td>
                                    <img src={require("../Image/edit.svg").default} onClick={() => {
                                        setModalActive(true);
                                        setInputName(flower.flowerSpecies);
                                        setSoil(flower.soil);
                                        setWater(flower.waterType);
                                        setFertilizers(flower.fertilizerType);
                                    }
                                    }/>
                                </td>
                                <td>
                                    <img src={require("../Image/delete.svg").default} onClick={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:8080/api/admin/best_env/flowers?flowerSpecies=${flower.flowerSpecies}`, {
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
                                        try {
                                            const response = await fetch('http://localhost:8080/api/admin/best_env/add', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    flowerSpecies: inputName,
                                                    soil: currentSoil,
                                                    waterType: currentWater,
                                                    fertilizerType: currentFertilizers,
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

};

export default FlowerTableAdmin;
