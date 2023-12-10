import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import axios, {AxiosResponse} from 'axios';
import './index.css';
import ModalAddFlower from "./Modal/modalAddFlower";

interface Flower {
    id: number;
    name: string;
    climate: string;
    soil: string;
    water: string;
    light: string;
    fertilizer: string;
}

let formAdd = document.getElementById('formAdd'),
    buttonAdd = document.getElementById('add'),
    closeAdd = document.getElementById('close');

const optionClimat = [
    {
        value: 'equatorial',
        label: 'Экваториальный'
    },
    {
        value: 'tropical',
        label: 'Тропический'
    },
    {
        value: 'moderate',
        label: 'Умеренный'
    },
    {
        value: 'polar',
        label: 'Полярный'
    }]

const optionSoil = [
    {
        value: 'calcareous',
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

const optionLight = [
    {
        value: 'solar',
        label: 'Солнечный'
    },
    {
        value: 'phytolamp',
        label: 'Фитолампа'
    },
    {
        value: 'led',
        label: 'Светодиодное'
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
    }]


const FlowerTable: React.FC = () => {
    const [id, setId]=useState('');
    const [flowerList, setFlowerList] = useState<Flower[]>([]);
    const [modalActive, setModalActive] = useState(false);
    const [inputName, setInputName] = useState('');
    const [currentClimat, setClimat] = useState('');
    const [currentSoil, setSoil] = useState('');
    const [currentWater, setWater] = useState();
    const [currentLight, setLight] = useState();
    const [currentFertilizers, setFertilizers] = useState();

    const getValueClimat = () => {
        return currentClimat ? optionClimat.find(c => c.value === currentClimat) : ''
    }
    const getValueSoil = () => {
        return currentSoil ? optionSoil.find(c => c.value === currentSoil) : ''
    }
    const getValueWater = () => {
        return currentWater ? optionWater.find(c => c.value === currentWater) : ''
    }

    const getValueLight = () => {
        return currentLight ? optionLight.find(c => c.value === currentLight) : ''
    }
    const getValueFertilizers = () => {
        return currentFertilizers ? optionFertilizers.find(c => c.value === currentFertilizers) : ''
    }

    const onChangeClimat = (newValue: any) => {
        setClimat(newValue.value)
        setSoil(newValue.value)
    }
    const onChangeSoil = (newValue: any) => {
        setSoil(newValue.value)
    }

    const onChangeWater = (newValue: any) => {
        setWater(newValue.value)
    }
    const onChangeLight = (newValue: any) => {
        setLight(newValue.value)
    }
    const onChangeFertilizers = (newValue: any) => {
        setFertilizers(newValue.value)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<Flower[]> = await axios.get(
                    'http://localhost:8080/api/flowers/1/flowers',
                    {
                        headers: {'Access-Control-Allow-Origin': '*'},
                    }
                );
                // handle success
                console.log(response);
                setFlowerList(response.data);
            } catch (error) {
                // handle error
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Растения</h1>
            <div className="button">
                <button className="add" onClick={() => setModalActive(true)}>Добавить</button>
                <button className="delete">Удалить</button>
                <button className="edit" onClick={() => setModalActive(true)}>Редактировать</button>
            </div>
            <table className="flower">
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Климат</th>
                    <th>Почва</th>
                    <th>Вода</th>
                    <th>Свет</th>
                    <th>Удобрение</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {flowerList.map((flower) => (
                    <tr key={flower.id}>
                        <td>{flower.name}</td>
                        <td>{flower.climate}</td>
                        <td>{flower.soil}</td>
                        <td>{flower.water}</td>
                        <td>{flower.light}</td>
                        <td>{flower.fertilizer}</td>
                        <td>
                            <button className="delete">Удалить</button>
                            <button className="edit" onClick={() => setModalActive(true)}>Редактировать</button>
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
                            <p>Климат</p>
                            <Select classNamePrefix="select_type" onChange={onChangeClimat} value={getValueClimat()}
                                    options={optionClimat}/>
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
                            <p>Свет</p>
                            <Select classNamePrefix="select_type" onChange={onChangeLight} value={getValueLight()}
                                    options={optionLight}/>
                        </td>
                        <td>
                            <p>Удобрения</p>
                            <Select classNamePrefix="select_type" onChange={onChangeFertilizers} value={getValueFertilizers()}
                                    options={optionFertilizers}/>
                        </td>
                    </tr>
                </table>

                <button
                    className="centerButton"
                    disabled={inputName.length === 0}
                    type="button"
                    onClick={async () => {
                        setId("-1");
                        console.log(inputName);
                        //setId((flowerList[flowerList.length - 1].id+1).toString())
                       try {
                            await axios({
                                url: "http://localhost:8080/",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                params: {
                                    id, inputName, currentClimat, currentSoil, currentWater, currentLight, currentFertilizers
                                },
                                method: "GET",
                                data: null
                            }).then(({data}) => {
                                return data;
                            });
                        } catch (e) {
                            console.log("Sending error", e);
                        }
                        setInputName('');
                        onChangeClimat('');
                        onChangeSoil('');
                        onChangeWater('');
                        onChangeLight('');
                        onChangeFertilizers('');
                        setModalActive(false);
                    }}
                >
                    Применить
                </button>
            </ModalAddFlower>
        </div>


    );
};

export default FlowerTable;
