import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './home.module.css'

import { BiSearch } from 'react-icons/bi'

interface CoinProps {
    name: string;
    delta_24h: string;
    price: string;
    symbol: string;
    volume_24h: string;
    market_cap: string;
    formatedPrice: string;
    formatedMarket: string;
}

interface DataProps {
    coins: CoinProps[];
}

export function Home() {
    const [coins, setCoins] = useState<CoinProps[]>([])
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            // https://sujeitoprogramador.com/api-cripto/?key=60486fc1342c7a2f
            // https://sujeitoprogramador.com/api-cripto/?key=60e2d5de4063d82
            fetch('https://sujeitoprogramador.com/api-cripto/?key=60486fc1342c7a2f')
                .then(res => res.json())
                .then((data: DataProps) => {

                    let coinsData = data.coins.slice(0, 15)

                    let price = Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })

                    const formatResult = coinsData.map((x) => {
                        const formated = {
                            ...x,
                            formatedPrice: price.format(Number(x.price)),
                            formatedMarket: price.format(Number(x.market_cap)),
                        }
                        return formated;
                    })

                    setCoins(formatResult)

                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getData();
    }, [])

    function handleSearch(e: FormEvent){
        e.preventDefault();

        if(inputValue === "") return;
        navigate(`/detail/${inputValue}`)
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSearch}>
                <input placeholder='Digite o simbolo da moeda: BTC...' 
                value={inputValue}
                onChange={ (e) => setInputValue(e.target.value) }
                />
                <button type='submit'>
                    <BiSearch size={30} color='#FFF' />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                    </tr>
                </thead>

                <tbody id='tbody'>
                    {coins.map(coin => (
                        <tr key={coin.name} className={styles.tr}>

                            <td className={styles.tdLabel} data-label='Moeda'>
                                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                                    <span>{coin.name}</span> | {coin.symbol}
                                </Link>
                            </td>
                            <td className={styles.tdLabel} data-label='Mercado'>
                                {coin.formatedMarket}
                            </td>
                            <td className={styles.tdLabel} data-label='Preço'>
                                {coin.formatedPrice}
                            </td>
                            <td className={Number(coin?.delta_24h.replace(',', '.')) >= 0 ? styles.tdProfit : styles.tdLoss} data-label='Volume'>
                                <span>{coin.delta_24h}</span>
                            </td>
                        </tr>
                    ))}

                </tbody>

            </table>





        </div>




    )
}