import { useNavigate, useParams } from 'react-router-dom'
import styles from './detail.module.css'
import { useEffect, useState } from 'react';

interface CoinProp {
  symbol: string;
  name: string;
  price: string;
  market_cap: string;
  low_24h: string;
  high_24h: string;
  total_volume_24h: string;
  delta_24h: string;
  formatedPrice: string;
  formatedMarket: string;
  formatedLowprice: string;
  formatedHighprice: string;
  error?: string;
}

export function Detail() {

  const { cripto } = useParams();
  const [detail, setrDetail] = useState<CoinProp>()
  const [loading, setloading] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    function getData() {
      fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=60486fc1342c7a2f&symbol=${cripto}`)
        .then(res => res.json())
        .then((data: CoinProp) => {

          if (data.error) {
            navigate("/")
          }

          let price = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          })

          const resultData = {
            ...data,
            formatedPrice: price.format(Number(data.price)),
            formatedMarket: price.format(Number(data.market_cap)),
            formatedLowprice: price.format(Number(data.low_24h)),
            formatedHighprice: price.format(Number(data.high_24h))
          }

          setrDetail(resultData)
          setloading(false)

        }, (err) => {
          console.log(err);
          navigate("/")
        })
    }

    getData();
  }, [cripto])

  if (loading) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando informações...</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{detail?.name}</h1>
      <p className={styles.center}>{detail?.symbol}</p>

      <section className={styles.content}>
        <p>
          <strong>Preço: </strong>{detail?.formatedPrice}
        </p>
        <p>
          <strong>Maior preço 24h: </strong>{detail?.formatedHighprice}
        </p>
        <p>
          <strong>Menor preço 24h: </strong>{detail?.formatedLowprice}
        </p>
        <p>
          <strong>Delta 24h:</strong>
          <span className={Number(detail?.delta_24h.replace(',', '.')) >= 0 ? styles.profit : styles.loss}>
            {detail?.delta_24h}
          </span>
        </p>
        <p>
          <strong>Valor mercado:</strong> {detail?.formatedMarket}
        </p>

      </section>
    </div>
  )
}
//https://sujeitoprogramador.com/api-cripto/coin/?key=SUA_CHAVE_AQUI&symbol=BTC
